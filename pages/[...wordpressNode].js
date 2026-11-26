import { getWordPressProps, WordPressTemplate } from '@faustwp/core';
import { findRedirect } from '../helpers/redirects';

export default function Page(props) {
    return <WordPressTemplate {...props} />;
}

export async function getStaticProps(ctx) {
    const result = await getWordPressProps({ ctx });

    if (!result.notFound) {
        return result;
    }

    // No page here: apply a redirect from the SEO options page, if any. Cached like any ISR result
    // and revalidated by the backend when redirects change.
    const redirect = await findRedirect(`/${(ctx.params?.wordpressNode ?? []).join('/')}`);

    return redirect ? { redirect, revalidate: result.revalidate } : result;
}

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking',
    };
}
