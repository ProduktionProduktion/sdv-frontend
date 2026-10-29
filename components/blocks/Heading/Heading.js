import { gql } from '@apollo/client';
import { HeadingView } from './HeadingView';

export const Heading = ({ key, ...props }) => {
    return <HeadingView key={key} {...props} />;
};

const COMPONENT_NAME = 'Heading';
const ACF_NAME = `Acf${COMPONENT_NAME}`;
const ACF_SLUG = COMPONENT_NAME.toLowerCase();
const FRAGMENT_KEY = `${COMPONENT_NAME}Fragment`;

Heading.fragments = {
    fragmentName: FRAGMENT_KEY,
    acfName: ACF_NAME,
    acfSlug: ACF_SLUG,
    entry: gql`
    fragment ${FRAGMENT_KEY} on ${COMPONENT_NAME} {
      align
      customSize
      heading
      tag
    }
  `,
};
