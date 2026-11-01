import styles from './Image.module.css';
import { getLayoutProps } from '@/helpers';
import { Figure } from '@/components/Figure';

export function ImageView({
    isAttachment,
    image,
    externalImage,
    externalImageDimensions,
    caption,
    alignment,
    customMaxWidth,
    layoutOptions,
    isChild,
    blockSlug,
    ImgComponent = 'img',
}) {
    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug);
    const classNames = [...layoutProps.classNames, styles.image];
    const imageNode = image?.node;

    if (alignment) {
        classNames.push(`-align-${alignment}`);
    }

    const figureProps = {
        ...layoutProps.attributes,
        className: classNames.join(' '),
        style: {
            ...layoutProps.styles,
            ...(customMaxWidth && { maxWidth: customMaxWidth }),
        },
    };

    const imageProps = {
        src: isAttachment ? imageNode?.sourceUrl : externalImage,
        alt: isAttachment ? imageNode?.altText : caption,
        width: isAttachment ? imageNode?.mediaDetails?.width : externalImageDimensions?.width,
        height: isAttachment ? imageNode?.mediaDetails?.height : externalImageDimensions?.height,
    };

    return (
        imageProps.src && (
            <Figure
                {...figureProps}
                altText={imageProps.alt}
                src={imageProps.src}
                width={imageProps.width}
                height={imageProps.height}
                sizes="100vw"
                caption={caption}
                ImageComponent={ImgComponent}
            />
        )
    );
}
