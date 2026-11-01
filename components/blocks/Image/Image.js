import { gql } from '@apollo/client';
import { ImageView } from './ImageView';
import { ImgNodeFragment } from '@/fragments/Media';
import NextImage from 'next/image';

export const Image = ({ key, ...props }) => <ImageView {...props} key={key} ImgComponent={NextImage} />;

const COMPONENT_NAME = 'Image';
const ACF_NAME = `Acf${COMPONENT_NAME}`;
const ACF_SLUG = COMPONENT_NAME.toLowerCase();
const FRAGMENT_KEY = `${COMPONENT_NAME}Fragment`;

Image.fragments = {
    fragmentName: FRAGMENT_KEY,
    acfName: ACF_NAME,
    acfSlug: ACF_SLUG,
    entry: gql`
    ${ImgNodeFragment}
    fragment ${FRAGMENT_KEY} on ${COMPONENT_NAME} {
      isAttachment
      externalImage
      externalImageDimensions {
        height
        width
      }
      caption
      alignment
      customMaxWidth
      image {
        ...ImgNodeFragment
      }
    }
  `,
};
