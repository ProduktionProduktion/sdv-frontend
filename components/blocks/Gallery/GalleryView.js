import styles from './Gallery.module.css';
import { getLayoutProps } from '../../../helpers';
import { Figure } from '@/components/Figure';

export function GalleryView({ imgComponent: ImgComponent = 'img', images, blockSlug, isChild, layoutOptions }) {
    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug);
    const classNames = [...layoutProps.classNames, styles.gallery];
    const imageNodes = (images?.nodes ?? []).filter((node) => node?.sourceUrl);

    if (!imageNodes.length) {
        return null;
    }

    return (
        <div {...layoutProps.attributes} className={classNames.join(' ')}>
            {imageNodes.map(({ id, altText, sourceUrl, caption, mediaDetails }) => (
                <Figure
                    key={id}
                    alt={altText}
                    src={sourceUrl}
                    width={mediaDetails?.width}
                    height={mediaDetails?.height}
                    caption={caption}
                    ImgComponent={ImgComponent}
                    className={styles.item}
                />
            ))}
        </div>
    );
}
