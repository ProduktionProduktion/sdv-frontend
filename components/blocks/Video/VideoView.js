import styles from './Video.module.css';
import { getLayoutProps } from '@/helpers';
import { LiteEmbed, parseVideoUrl } from '@/components/LiteEmbed';

export function VideoView({
    isUrl,
    videoUrl,
    video,
    options,
    caption,
    layoutOptions,
    isChild,
    blockSlug,
    imgComponent = 'img',
}) {
    const videoPost = video?.nodes?.[0];
    const { vimeoUrl, posterUrl, poster, dimensions } = videoPost?.videoPostFields ?? {};
    const embed = parseVideoUrl(isUrl ? videoUrl : vimeoUrl);

    if (!embed) {
        return null;
    }

    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug);
    const classNames = [...layoutProps.classNames, styles.video];
    const posterNode = !isUrl ? poster?.node : null;
    const { width, height } = dimensions?.width && dimensions?.height ? dimensions : (posterNode?.mediaDetails ?? {});

    const posterProps = posterNode?.sourceUrl
        ? {
              src: posterNode.sourceUrl,
              alt: posterNode.altText,
              width: posterNode.mediaDetails?.width,
              height: posterNode.mediaDetails?.height,
          }
        : !isUrl && posterUrl
          ? { src: posterUrl }
          : null;

    return (
        <figure {...layoutProps.attributes} className={classNames.join(' ')} style={layoutProps.styles}>
            <LiteEmbed
                {...embed}
                className={styles.embed}
                title={videoPost?.title ?? 'Video'}
                poster={posterProps}
                imgComponent={posterNode?.sourceUrl ? imgComponent : 'img'}
                autoplay={options?.includes('autoplay')}
                loop={options?.includes('loop')}
                aspectRatio={width && height ? `${width} / ${height}` : null}
            />
            {caption && <figcaption dangerouslySetInnerHTML={{ __html: caption }} />}
        </figure>
    );
}
