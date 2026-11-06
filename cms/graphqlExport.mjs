// scripts/export-block-queries.mjs
import { print, parse, visit, Kind } from 'graphql';
import { writeFileSync, mkdirSync } from 'node:fs';
import * as BLOCKS from '@/wp-blocks';
import { LayoutSettingsFragment } from '@/fragments/LayoutSettings';
import { ImgFragment, ImgNodeFragment } from '@/fragments/Media';

const shared = [LayoutSettingsFragment, ImgFragment, ImgNodeFragment];

function prune(defs) {
    const frags = new Map(defs.filter((d) => d.kind === Kind.FRAGMENT_DEFINITION).map((d) => [d.name.value, d]));
    const op = defs.find((d) => d.kind === Kind.OPERATION_DEFINITION);
    const used = new Set();
    const walk = (n) =>
        visit(n, {
            FragmentSpread: ({ name: { value } }) => {
                if (!used.has(value)) {
                    used.add(value);
                    walk(frags.get(value));
                }
            },
        });
    walk(op);
    return [op, ...[...used].map((n) => frags.get(n))];
}

export function exportBlockQueries(out) {
    mkdirSync(out, { recursive: true });
    const files = [];
    for (const {
        fragments: { fragmentName, acfName, acfSlug, entry },
    } of Object.values(BLOCKS).filter((block) => block?.fragments)) {
        const op = parse(`query ${acfName}Data($block: String!) {
    blockData(block: $block) {
      __typename
      ...LayoutSettings
      ... on ${acfName} { ${acfSlug} { ...${fragmentName} } }
    }
  }`);
        const defs = prune([...op.definitions, ...[entry, ...shared].flatMap((d) => d.definitions)]);
        writeFileSync(`${out}/${acfSlug}.graphql`, print({ kind: Kind.DOCUMENT, definitions: defs }));
        files.push(`${acfSlug}.graphql`);
    }
    return files;
}
