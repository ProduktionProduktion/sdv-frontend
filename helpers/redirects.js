import { getApolloClient } from '@faustwp/core';
import { RedirectsQuery } from '../fragments/Redirects';

const normalize = (path) => `/${path.split('/').filter(Boolean).join('/')}`.toLowerCase();

/**
 * Redirect for a path with no WordPress page, from the SEO options page. Matches exact paths,
 * ignoring case and trailing slashes. Returns a Next.js `redirect` object or null.
 */
export async function findRedirect(path) {
    const { data } = await getApolloClient().query({ query: RedirectsQuery, fetchPolicy: 'network-only' });
    const target = normalize(path);
    const match = (data?.seoSettings?.seoDefaults?.redirects ?? []).find(
        (redirect) => redirect?.from && redirect.to?.url && normalize(redirect.from) === target,
    );

    return match ? { destination: match.to.url, permanent: Boolean(match.permanent) } : null;
}
