import { gql } from "@apollo/client";
import { ImageView } from "./ImageView";
import { ImgFragment } from "@/fragments/Media";

export const Image = (props) => <ImageView {...props} />;

const COMPONENT_NAME = 'Image';
const ACF_NAME = `Acf${COMPONENT_NAME}`;
const ACF_SLUG = COMPONENT_NAME.toLowerCase();
const FRAGMENT_KEY = `${COMPONENT_NAME}Fragment`;

Image.fragments = {
  fragmentName: FRAGMENT_KEY,
  acfName: ACF_NAME,
  acfSlug: ACF_SLUG,
  entry: gql`
    ${ImgFragment}
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
      bleed
      biggerOnSm
      image {
        ...ImgNodeFragment
      }
    }
  `
};
