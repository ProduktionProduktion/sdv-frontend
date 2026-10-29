import { gql } from '@apollo/client';
import { GalleryView } from './GalleryView';
import { ImgFragment } from '@/fragments/Media';
import NextImage from 'next/image';

export const Gallery = ({ key, ...props }) => <GalleryView {...props} imgComponent={NextImage} key={key} />;

const COMPONENT_NAME = 'Gallery';
const ACF_NAME = `Acf${COMPONENT_NAME}`;
const ACF_SLUG = COMPONENT_NAME.toLowerCase();
const FRAGMENT_KEY = `${COMPONENT_NAME}Fragment`;

Gallery.fragments = {
    fragmentName: FRAGMENT_KEY,
    acfName: ACF_NAME,
    acfSlug: ACF_SLUG,
    entry: gql`
    ${ImgFragment}
    fragment ${FRAGMENT_KEY} on ${COMPONENT_NAME} {
      images {
        nodes {
          ...ImgFragment
        }
      }
    }
  `,
};
