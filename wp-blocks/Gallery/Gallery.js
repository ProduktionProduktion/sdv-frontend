import { gql } from '@apollo/client';
import { GalleryView } from './GalleryView';
import { MediaFragment } from '@/fragments/Media';
import NextImage, { getImageProps } from 'next/image';

export const Gallery = ({ key, ...props }) => <GalleryView {...props} imgComponent={NextImage} key={key} getImageProps={getImageProps} />;

const COMPONENT_NAME = 'Gallery';
const ACF_NAME = `Acf${COMPONENT_NAME}`;
const ACF_SLUG = COMPONENT_NAME.toLowerCase();
const FRAGMENT_KEY = `${COMPONENT_NAME}Fragment`;

Gallery.fragments = {
    fragmentName: FRAGMENT_KEY,
    acfName: ACF_NAME,
    acfSlug: ACF_SLUG,
    entry: gql`
    ${MediaFragment}
    fragment ${FRAGMENT_KEY} on ${COMPONENT_NAME} {
      images {
        nodes {
          ...MediaFragment
        }
      }
    }
  `,
};
