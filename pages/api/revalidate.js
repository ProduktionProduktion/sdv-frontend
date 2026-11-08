// How many pages to regenerate at once. Each revalidation re-runs
// getStaticProps (= GraphQL requests to WordPress), so a full-site
// revalidation (menu/footer change) shouldn't fire them all in parallel.
const CONCURRENCY = 6;

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    if (req.headers['x-revalidate-secret'] !== process.env.REVALIDATE_SECRET) {
        return res.status(401).json({ message: 'Invalid secret' });
    }

    const paths = [...new Set([].concat(req.body?.paths ?? []))].filter((p) => typeof p === 'string' && p.startsWith('/'));

    if (!paths.length) {
        return res.status(400).json({ message: 'No paths' });
    }

    const results = [];

    for (let i = 0; i < paths.length; i += CONCURRENCY) {
        const batch = paths.slice(i, i + CONCURRENCY);
        results.push(...(await Promise.allSettled(batch.map((p) => res.revalidate(p)))));
    }

    const failed = paths.filter((_, i) => results[i].status === 'rejected');

    if (failed.length) {
        console.warn('revalidate failed', failed);
    }

    return res.json({
        revalidated: paths.filter((_, i) => results[i].status === 'fulfilled'),
        failed,
    });
}
