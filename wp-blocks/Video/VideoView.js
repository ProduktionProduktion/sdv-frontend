import styles from './Video.module.css';
import { getLayoutProps } from '@/helpers';
import { LiteEmbed, parseVideoUrl } from '@/components/LiteEmbed';
import { getMediaVideo } from '@/components/MediaFigure';

export function VideoView({
    isUrl,
    videoUrl,
    video,
    options,
    caption,
    layoutOptions,
    isChild,
    blockSlug,
    getImageProps = null,
    imgComponent = 'img',
}) {
    const embed = isUrl ? parseVideoUrl(videoUrl) : getMediaVideo(video?.node, imgComponent);

    if (!embed) {
        return null;
    }

    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug, getImageProps);
    const classNames = [...layoutProps.classNames, styles.video];

    return (
        <figure {...layoutProps.attributes} className={classNames.join(' ')} style={layoutProps.styles}>
            <LiteEmbed
                {...embed}
                className={styles.embed}
                autoplay={options?.includes('autoplay')}
                loop={options?.includes('loop')}
            />
            {caption && <figcaption dangerouslySetInnerHTML={{ __html: caption }} />}
        </figure>
    );
}
