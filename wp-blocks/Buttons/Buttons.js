import { gql } from '@apollo/client';
import { ButtonsView } from './ButtonsView';
import NextLink from 'next/link';

export const Buttons = ({ key, ...props }) => <ButtonsView key={key} LinkComponent={NextLink} {...props} />;

const COMPONENT_NAME = 'Buttons';
const ACF_NAME = `Acf${COMPONENT_NAME}`;
const ACF_SLUG = COMPONENT_NAME.toLowerCase();
const FRAGMENT_KEY = `${COMPONENT_NAME}Fragment`;

Buttons.fragments = {
    fragmentName: FRAGMENT_KEY,
    acfName: ACF_NAME,
    acfSlug: ACF_SLUG,
    entry: gql`
    fragment ${FRAGMENT_KEY} on ${COMPONENT_NAME} {
      align
      buttons {
        link {
          target
          title
          url
        }
        color
        size
        style
      }
    }
  `,
};
