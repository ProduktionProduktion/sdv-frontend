import Image from "next/image";
import styles from './Image.module.css';
import { getLayoutProps } from '../../../helpers';

export function ImageView({ isAttachment, image: {node: imageNode}, externalImage, externalImageDimensions, caption, alignment, customMaxWidth, bleed, biggerOnSm, layoutOptions }) {
  // console.log('Image props:', {isAttachment, imageNode, externalImage, externalImageDimensions, caption, alignment, customMaxWidth, bleed, biggerOnSm});

  const layoutProps = getLayoutProps(layoutOptions || {});
  const classNames = [...layoutProps.classNames, styles.image];
  
  if (bleed) {
    classNames.push('-bleed');
  }
  
  if (biggerOnSm) {
    classNames.push('-bigger-on-sm');
  }

  if (alignment) {
    classNames.push(`-align-${alignment}`);
  }

  const figureProps = {
    ...layoutProps.attributes,
    className: classNames.join(' '),
    style: {
      ...layoutProps.styles,
      ...customMaxWidth && {maxWidth: customMaxWidth},
    },
  };

  const imageProps = {
    width: isAttachment ? imageNode?.mediaDetails?.width : externalImageDimensions?.width,
    height: isAttachment ? imageNode?.mediaDetails?.height : externalImageDimensions?.height,
  };
  
  return (
    <figure {...figureProps}>
      {/* <img alt={isAttachment ? imageNode?.altText : caption} src={isAttachment ? imageNode?.sourceUrl : externalImage} {...imageProps} /> */}
      <Image alt={isAttachment ? imageNode?.altText : caption} src={isAttachment ? imageNode?.sourceUrl : externalImage} {...imageProps} />
      {caption && <figcaption dangerouslySetInnerHTML={{ __html: caption }} />}
    </figure>
  );
}