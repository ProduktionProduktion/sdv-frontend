import { gql } from '@apollo/client';
import { VideoView } from './VideoView';
import { MediaFragment } from '@/fragments/Media';
import NextImage from 'next/image';

export const Video = ({ key, ...props }) => <VideoView {...props} key={key} imgComponent={NextImage} />;

const COMPONENT_NAME = 'Video';
const ACF_NAME = `Acf${COMPONENT_NAME}`;
const ACF_SLUG = COMPONENT_NAME.toLowerCase();
const FRAGMENT_KEY = `${COMPONENT_NAME}Fragment`;

Video.fragments = {
    fragmentName: FRAGMENT_KEY,
    acfName: ACF_NAME,
    acfSlug: ACF_SLUG,
    entry: gql`
    ${MediaFragment}
    fragment ${FRAGMENT_KEY} on ${COMPONENT_NAME} {
      isUrl
      videoUrl
      options
      caption
      video {
        node {
          ...MediaFragment
        }
      }
    }
  `,
};
