export const Figure = ({
    id,
    className,
    altText,
    src,
    width,
    height,
    sizes,
    caption = null,
    ImageComponent = 'img',
}) => {
    // console.log({ id, className, altText, src, width, height, caption, ImageComponent });
    return (
        <figure key={id} className={className}>
            <ImageComponent alt={altText ?? ''} src={src} width={width} height={height} sizes={sizes} />
            {caption && <figcaption dangerouslySetInnerHTML={{ __html: caption }} />}
        </figure>
    );
};
