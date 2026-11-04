<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project notes

- Faust.js (Pages Router) + WPGraphQL. Backend theme: `sdv-backend/app/public/web/app/themes/headless` (ACF Composer).
- Keep `wp-templates/index.js` imports static: Faust's `WordPressTemplate` renders nothing during SSR for `dynamic()` templates.
- After adding ACF field groups/interfaces in the backend, run `npm run generate` to refresh `possibleTypes.json` (needed for interface fragments like `... on WithAcfSeoFields`).
- SEO: `components/Seo` renders head tags from `Seo.fragments.settings` (RootQuery) and `Seo.fragments.node` (ContentNode). Needs `NEXT_PUBLIC_SITE_URL`.
- Local GraphQL endpoint for curl: `https://sdv-backend.local/index.php?graphql` (`/graphql` gets redirected by Faust).
- Lint: `npx eslint <paths>`.
- Video: an image attachment with `videoFields.videoUrl` is a video poster (backend `Modules/Video/VideoAttachment.php`). Query images with `MediaFragment` and render with `MediaFigure`, which falls back to `Figure`.
- WP-CLI (Local): `DB_HOST="localhost:$HOME/Library/Application Support/Local/run/Ae2NgXn-r/mysql/mysqld.sock" wp …` from `sdv-backend/app/public`.
