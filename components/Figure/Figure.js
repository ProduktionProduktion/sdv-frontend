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
    loading = 'lazy',
    ...props
}) => {
    const classNames = [className, width < height ? '-portrait' : '-landscape'].filter(Boolean).join(' ');

    return (
        <figure key={id} className={classNames} {...props}>
            <ImageComponent
                alt={altText ?? ''}
                src={src}
                width={width}
                height={height}
                sizes={sizes}
                loading={loading}
            />
            {caption && caption !== '' && <figcaption dangerouslySetInnerHTML={{ __html: caption }} />}
        </figure>
    );
};
