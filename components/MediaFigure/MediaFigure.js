import { Figure } from '@/components/Figure';
import { LiteEmbed, parseVideoUrl } from '@/components/LiteEmbed';
import styles from './MediaFigure.module.css';

/**
 * LiteEmbed props for an image attachment with a video URL (see MediaFragment), or null
 */
export const getMediaVideo = (media, ImageComponent = 'img') => {
    const { sourceUrl, altText, mediaDetails, videoFields } = media ?? {};
    const embed = parseVideoUrl(videoFields?.videoUrl);

    if (!embed) {
        return null;
    }

    const { videoDimensions: dimensions, videoOptions: options = [] } = videoFields;
    const { width, height } = dimensions?.width && dimensions?.height ? dimensions : (mediaDetails ?? {});

    return {
        ...embed,
        title: altText || 'Video',
        poster: sourceUrl
            ? { src: sourceUrl, alt: altText, width: mediaDetails?.width, height: mediaDetails?.height }
            : null,
        imgComponent: ImageComponent,
        autoplay: !!options?.includes('autoplay'),
        loop: !!options?.includes('loop'),
        aspectRatio: width && height ? `${width} / ${height}` : null,
        width,
        height,
    };
};

/**
 * Renders an image, or a video when the image is a video poster
 */
export function MediaFigure({ media, className, sizes, caption = null, ImageComponent = 'img', loading = 'lazy' }) {
    const video = getMediaVideo(media, ImageComponent);

    if (!video) {
        return media?.sourceUrl ? (
            <Figure
                altText={media.altText}
                src={media.sourceUrl}
                width={media.mediaDetails?.width}
                height={media.mediaDetails?.height}
                sizes={sizes}
                caption={caption}
                ImageComponent={ImageComponent}
                loading={loading}
                className={className}
            />
        ) : null;
    }

    const { width, height } = video;
    const classNames = [className, styles.video, '-video', width < height ? '-portrait' : '-landscape'];

    return (
        <figure
            className={classNames.filter(Boolean).join(' ')}
            style={width && height ? { '--media-ratio': width / height } : undefined}>
            <LiteEmbed {...video} sizes={sizes} className={styles.embed} />
            {caption && <figcaption dangerouslySetInnerHTML={{ __html: caption }} />}
        </figure>
    );
}
