import styles from './Gallery.module.css';
import { getLayoutProps } from '../../../helpers';
import { Figure } from '@/components/Figure';

export function GalleryView({
    imgComponent: ImgComponent = 'img',
    images: { nodes: imageNodes },
    blockSlug,
    isChild,
    layoutOptions,
}) {
    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug);
    const classNames = [...layoutProps.classNames, styles.gallery];

    return (
        <div {...layoutProps.attributes} className={classNames.join(' ')}>
            {imageNodes.map(({ id, altText, sourceUrl, caption, mediaDetails: { width, height } }) => (
                <Figure
                    key={id}
                    alt={altText}
                    src={sourceUrl}
                    width={width}
                    height={height}
                    caption={caption}
                    ImgComponent={ImgComponent}
                    className={styles.item}
                />
            ))}
        </div>
    );
}
