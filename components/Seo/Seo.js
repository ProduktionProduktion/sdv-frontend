import Head from 'next/head';
import { SeoNodeFragment, SeoSettingsFragment } from '@/fragments/Seo';
import { decodeHTMLEntities, getViewTitle } from '@/helpers';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '');
const DESCRIPTION_LENGTH = 160;

const toPlainText = (html) =>
    decodeHTMLEntities(
        (html ?? '')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim(),
    );

const truncate = (text, length = DESCRIPTION_LENGTH) =>
    text.length > length ? `${text.slice(0, length - 1).trimEnd()}…` : text;

export default function Seo({ node, settings, viewTitle = null, parentTitle = null, type = 'website' }) {
    const { generalSettings, seoSettings } = settings ?? {};
    const defaults = seoSettings?.seoDefaults ?? {};
    const fields = node?.seoFields ?? {};
    const siteTitle = decodeHTMLEntities(generalSettings?.title ?? '');

    const title = fields.seoTitle || getViewTitle(viewTitle, siteTitle, parentTitle);
    const shareTitle = fields.seoTitle || (viewTitle ? decodeHTMLEntities(viewTitle) : siteTitle);
    const description =
        fields.seoDescription ||
        truncate(toPlainText(node?.excerpt)) ||
        defaults.defaultDescription ||
        toPlainText(generalSettings?.description);
    const image = fields.seoImage?.node ?? node?.featuredImage?.node ?? defaults.defaultOgImage?.node;
    const url =
        SITE_URL && node?.uri ? `${SITE_URL}${new URL(node.uri, SITE_URL).pathname.replace(/(.)\/$/, '$1')}` : null;
    const canonical = fields.seoCanonical || url;
    const noindex = fields.seoNoindex || defaults.discourageIndexing;

    return (
        <Head>
            <title>{title}</title>

            {/* <link rel="icon" href="/icon.svg" type="image/svg+xml" /> */}
            <link rel="icon" href="/api/icon?size=favicon" type="image/png" sizes="32x32" />
            <link rel="apple-touch-icon" href="/api/icon?size=apple" sizes="180x180" />

            {description && <meta key="description" name="description" content={description} />}
            {canonical && <link key="canonical" rel="canonical" href={canonical} />}
            {noindex && <meta key="robots" name="robots" content="noindex, nofollow" />}

            <meta key="og:type" property="og:type" content={type} />
            <meta key="og:title" property="og:title" content={shareTitle} />
            {siteTitle && <meta key="og:site_name" property="og:site_name" content={siteTitle} />}
            {description && <meta key="og:description" property="og:description" content={description} />}
            {canonical && <meta key="og:url" property="og:url" content={canonical} />}
            {image?.sourceUrl && <meta key="og:image" property="og:image" content={image.sourceUrl} />}
            {image?.mediaDetails?.width && (
                <meta key="og:image:width" property="og:image:width" content={String(image.mediaDetails.width)} />
            )}
            {image?.mediaDetails?.height && (
                <meta key="og:image:height" property="og:image:height" content={String(image.mediaDetails.height)} />
            )}
            {image?.altText && <meta key="og:image:alt" property="og:image:alt" content={image.altText} />}

            <meta key="twitter:card" name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
            {defaults.twitterHandle && <meta key="twitter:site" name="twitter:site" content={defaults.twitterHandle} />}
        </Head>
    );
}

Seo.fragments = {
    settings: SeoSettingsFragment,
    node: SeoNodeFragment,
};
