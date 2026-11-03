import { gql } from '@apollo/client';
import { EditorView } from './EditorView';

export const Editor = ({ key, ...props }) => {
    return <EditorView key={key} {...props} />;
};

const COMPONENT_NAME = 'Editor';
const ACF_NAME = `Acf${COMPONENT_NAME}`;
const ACF_SLUG = COMPONENT_NAME.toLowerCase();
const FRAGMENT_KEY = `${COMPONENT_NAME}Fragment`;

Editor.fragments = {
    fragmentName: FRAGMENT_KEY,
    acfName: ACF_NAME,
    acfSlug: ACF_SLUG,
    entry: gql`
    fragment ${FRAGMENT_KEY} on ${COMPONENT_NAME} {
      content
      dontLimitWidth
      columns
      align
    }
  `,
};
