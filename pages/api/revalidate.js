export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    console.log('revalidate.js', req.headers);
    console.log('revalidate.js', process.env.REVALIDATE_SECRET);

    if (req.headers['x-revalidate-secret'] !== process.env.REVALIDATE_SECRET) {
        return res.status(401).json({ message: 'Invalid secret' });
    }

    const paths = [].concat(req.body?.paths ?? []);

    if (!paths.length) {
        return res.status(400).json({ message: 'No paths' });
    }

    const results = await Promise.allSettled(paths.map((p) => res.revalidate(p)));

    console.log('revalidate.js', results);

    return res.json({
        revalidated: paths.filter((_, i) => results[i].status === 'fulfilled'),
        failed: paths.filter((_, i) => results[i].status === 'rejected'),
    });
}
