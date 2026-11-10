/**
 * Vite plugin: exports the fonts declared in helpers/fonts.js as a standalone
 * fonts.css (+ woff2 files) for the CMS, without any next/font runtime code.
 *
 * helpers/fonts.js stays the single source of truth: it is evaluated with
 * `next/font/local` and `next/font/google` replaced by a shim that records every
 * call. Local files are copied, Google fonts are downloaded (self-hosted, like next/font).
 */
import { runnerImport } from 'vite';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const UA =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

// Replaces next/font/* with modules that record their options and return a next/font-like object.
const nextFontShim = () => ({
    name: 'next-font-shim',
    enforce: 'pre',
    async resolveId(id, importer) {
        if (id === 'next/font/local') return `\0next-font:local:${encodeURIComponent(path.dirname(importer))}`;
        if (id === 'next/font/google') {
            const src = await fs.readFile(importer, 'utf8');
            const match = src.match(/import\s*\{([^}]*)\}\s*from\s*['"]next\/font\/google['"]/);
            const names = (match?.[1] ?? '')
                .split(',')
                .map((s) => s.trim().split(/\s+as\s+/)[0])
                .filter(Boolean);
            return `\0next-font:google:${names.join(',')}`;
        }
        return null;
    },
    load(id) {
        if (!id.startsWith('\0next-font:')) return null;
        const [, kind, arg] = id.split(':');
        const record = `const record = (call) => globalThis.__nextFontExport.push(call) && ({
            className: '',
            variable: call.options.variable ?? '',
            style: { fontFamily: "'" + call.family + "'" },
        });`;
        if (kind === 'local') {
            const dir = JSON.stringify(decodeURIComponent(arg));
            return `${record}
                export default (options) => record({ kind: 'local', dir: ${dir}, options,
                    family: (options.variable ?? '--font-local').replace(/^--/, '') });`;
        }
        return `${record}\n${arg
            .split(',')
            .filter(Boolean)
            .map(
                (name) =>
                    `export const ${name} = (options = {}) => record({ kind: 'google', options, family: ${JSON.stringify(name.replace(/_/g, ' '))} });`
            )
            .join('\n')}`;
    },
});

const fontFace = (props) =>
    `@font-face {\n${Object.entries(props)
        .filter(([, v]) => v != null)
        .map(([k, v]) => `    ${k}: ${v};`)
        .join('\n')}\n}`;

async function exportLocal({ dir, family, options }, fontsDir, fontsUrl) {
    const sources = typeof options.src === 'string' ? [{ path: options.src }] : options.src;
    const blocks = [];
    for (const src of sources) {
        const file = path.basename(src.path);
        await fs.copyFile(path.resolve(dir, src.path), path.join(fontsDir, file));
        const format = path.extname(file).slice(1).replace('ttf', 'truetype').replace('otf', 'opentype');
        blocks.push(
            fontFace({
                'font-family': `'${family}'`,
                src: `url('${fontsUrl}${file}') format('${format}')`,
                'font-weight': src.weight ?? options.weight,
                'font-style': src.style ?? options.style,
                'font-display': options.display ?? 'swap',
            })
        );
    }
    return blocks;
}

function googleCssUrl(family, options) {
    const data = require('next/dist/compiled/@next/font/dist/google/font-data.json')[family];
    if (!data) throw new Error(`[fonts-export] Unknown Google font "${family}"`);

    const styles = [].concat(options.style ?? 'normal');
    let weights = options.weight ? [].concat(options.weight) : ['variable'];
    if (weights.includes('variable')) {
        const wght = data.axes?.find((a) => a.tag === 'wght');
        if (!wght) throw new Error(`[fonts-export] "${family}" is not variable, set a weight`);
        weights = [`${wght.min}..${wght.max}`];
    }
    weights.sort((a, b) => parseFloat(a) - parseFloat(b));

    const axis = styles.includes('italic')
        ? `ital,wght@${styles
              .map((s) => (s === 'italic' ? 1 : 0))
              .sort()
              .flatMap((i) => weights.map((w) => `${i},${w}`))
              .join(';')}`
        : `wght@${weights.join(';')}`;

    return `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:${axis}&display=${options.display ?? 'swap'}`;
}

async function exportGoogle({ family, options }, fontsDir, fontsUrl) {
    const url = googleCssUrl(family, options);
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`[fonts-export] ${res.status} fetching ${url}`);
    const css = await res.text();

    const subsets = options.subsets ? [].concat(options.subsets) : null;
    const blocks = [];
    for (const [, subset, block] of css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)) {
        if (subsets && !subsets.includes(subset)) continue;
        let out = block;
        for (const [, fontUrl] of block.matchAll(/url\((https:[^)]+)\)/g)) {
            const file = `${family.replace(/\s+/g, '')}-${path.basename(new URL(fontUrl).pathname)}`;
            const font = await fetch(fontUrl, { headers: { 'User-Agent': UA } });
            if (!font.ok) throw new Error(`[fonts-export] ${font.status} fetching ${fontUrl}`);
            await fs.writeFile(path.join(fontsDir, file), Buffer.from(await font.arrayBuffer()));
            out = out.replace(fontUrl, `'${fontsUrl}${file}'`);
        }
        blocks.push(`/* ${subset} */\n${out}`);
    }
    return blocks;
}

/**
 * @param {object} opts
 * @param {string} opts.entry   Module that calls next/font (e.g. './helpers/fonts.js')
 * @param {string} opts.outDir  Where fonts.css and fonts/ are written
 * @param {string} [opts.fontsUrl] Prefix for font urls in fonts.css (default './fonts/', relative to fonts.css)
 * @param {Record<string,string>} [opts.aliases] Extra custom properties, e.g. { '--font-navigation': '--font-heading' }
 * @param {object} [opts.resolve] Vite resolve options (aliases)
 */
export const fontsExport = ({ entry, outDir, fontsUrl = './fonts/', aliases = {}, resolve }) => ({
    name: 'fonts-export',
    apply: 'build',
    async closeBundle() {
        globalThis.__nextFontExport = [];
        await runnerImport(entry, {
            configFile: false,
            logLevel: 'error',
            resolve,
            // Don't externalize next/*, so the shim gets to resolve next/font/*
            environments: { inline: { resolve: { noExternal: ['next'] } } },
            plugins: [nextFontShim()],
        });
        const calls = globalThis.__nextFontExport;
        delete globalThis.__nextFontExport;

        const fontsDir = path.join(outDir, 'fonts');
        await fs.rm(fontsDir, { recursive: true, force: true });
        await fs.mkdir(fontsDir, { recursive: true });

        const faces = [];
        const vars = [];
        for (const call of calls) {
            faces.push(...(call.kind === 'local' ? await exportLocal(call, fontsDir, fontsUrl) : await exportGoogle(call, fontsDir, fontsUrl)));
            if (call.options.variable) vars.push(`    ${call.options.variable}: '${call.family}';`);
        }
        for (const [name, target] of Object.entries(aliases)) vars.push(`    ${name}: var(${target});`);

        const css = `/* Generated by cms/fontsExport.mjs from ${entry}. Do not edit. */\n\n${faces.join('\n\n')}\n\n:root {\n${vars.join('\n')}\n}\n`;
        await fs.writeFile(path.join(outDir, 'fonts.css'), css);
    },
});
