import { gql } from '@apollo/client';
import { EventsView } from './EventsView';
import { LinkFragment } from '../../../fragments/Link';

export const Events = ({ key, ...props }) => <EventsView key={key} {...props} />;

const COMPONENT_NAME = 'Events';
const ACF_NAME = `Acf${COMPONENT_NAME}`;
const ACF_SLUG = COMPONENT_NAME.toLowerCase();
const FRAGMENT_KEY = `${COMPONENT_NAME}Fragment`;

Events.fragments = {
    fragmentName: FRAGMENT_KEY,
    acfName: ACF_NAME,
    acfSlug: ACF_SLUG,
    entry: gql`
    ${LinkFragment}
    fragment ${FRAGMENT_KEY} on ${COMPONENT_NAME} {
      displayUpcoming
      customHeading
      events { #field
        nodes { #posts
          ... on EventPost { #post_type
            id #post (event) > id
            title #post (event) > title
            link
            eventPostFields {
              date
              shortDescription
              eventLink {
                ...LinkFragment
              }
              hideButton
            }
          }
        }
      }
    }
  `,
};
