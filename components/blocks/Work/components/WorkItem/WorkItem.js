import { Figure } from '@/components/Figure';

export function WorkItem({
    id,
    uri,
    title,
    workPostFields,
    featuredImage,
    index,
    classNames = { item: 'item', _inner: '_inner', _info: '_info', _shortDescription: '_shortDescription' },
    linkComponent: Link = 'a',
    onClick = () => null,
}) {
    const { shortDescription, metaDescription /*firstDate: firstDateRaw, location*/ } = workPostFields ?? {};
    const { id: imageId, altText, sourceUrl, caption, mediaDetails } = featuredImage?.node ?? {};
    const { width, height } = mediaDetails ?? {};
    // const firstDate = firstDateRaw ? new Date(firstDateRaw).toLocaleDateString('sv-SE') : null;

    return (
        <>
            <article onClick={() => onClick(uri)} key={id} data-index={index} className={`${classNames.item}`}>
                <div className={classNames._inner}>
                    {sourceUrl && (
                        <Figure
                            key={imageId}
                            alt={altText}
                            src={sourceUrl}
                            width={width}
                            height={height}
                            caption={caption}
                        />
                    )}
                    <div className={classNames._info}>
                        <h1>{title}</h1>
                        {shortDescription && <main className={classNames._shortDescription}>{shortDescription}</main>}
                        {metaDescription && (
                            <aside
                                className={`${classNames._meta} font-mono`}
                                dangerouslySetInnerHTML={{ __html: metaDescription }}
                            />
                        )}
                        <Link className="visually-hidden" href={uri}>{`Go to "${title}"`}</Link>
                    </div>
                </div>
            </article>
        </>
    );
}
