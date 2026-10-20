import { gql } from '@apollo/client';
import * as BLOCKS from '../components/blocks';
import { LayoutSettingsFragment } from './LayoutSettings';

const blocks = Object.values(BLOCKS);

const allFragments = blocks
  .map(({ fragments }) => fragments.entry)
  .reduce((acc, doc) => gql`${acc}${doc}`);

const blockSelections = blocks
  .map(({ fragments: { fragmentName, acfName, acfSlug } }) => `
      ... on ${acfName} {
        ${acfSlug} {
          ...${fragmentName}
        }
      }`
  )
.join('');

export const BlockEditorFragment = gql`
  ${allFragments}
  ${LayoutSettingsFragment}

  fragment BlockEditorFragment on NodeWithEditorBlocks {
    editorBlocks(flat: true) {
      __typename
      name
      clientId
      parentClientId
      ...LayoutSettings
      ${blockSelections}
    }
  }
`;
