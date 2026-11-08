import styles from './Gallery.module.css';
import { getLayoutProps } from '@/helpers';
import { MediaFigure } from '@/components/MediaFigure';

export function GalleryView({ imgComponent: ImgComponent = 'img', images, blockSlug, getImageProps = null, isChild, layoutOptions }) {
    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug, getImageProps);
    const classNames = [...layoutProps.classNames, styles.gallery];
    const imageNodes = (images?.nodes ?? []).filter((node) => node?.sourceUrl);

    if (!imageNodes.length) {
        return null;
    }

    return (
        <div {...layoutProps.attributes} className={classNames.join(' ')}>
            {imageNodes.map((node) => (
                <MediaFigure
                    key={node.id}
                    media={node}
                    sizes="300px"
                    caption={node.caption}
                    ImageComponent={ImgComponent}
                    className={styles.item}
                />
            ))}
        </div>
    );
}
