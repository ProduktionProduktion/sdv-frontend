# Salorant & de Vylder

Headless frontend for SDV: [Next.js](https://nextjs.org) 16 (Pages Router) + [Faust.js](https://faustjs.org), reading content from WordPress through WPGraphQL.

The backend lives in [`sdv-backend`](https://github.com/ProduktionProduktion/sdv-backend) (Bedrock + the `headless` theme, ACF Composer). Besides the site, this repo also builds the block components that the WordPress editor uses for previews (see [CMS components](#cms-components)).

## Requirements

- Node (version in `.nvmrc`, `nvm use`)
- A running `sdv-backend` (e.g. locally via Local) with Faust and WPGraphQL enabled
- `gh` CLI, authenticated, for `npm run deploy`

## Getting started

```bash
nvm use
npm ci
cp .env.example .env.local   # then fill in, see below
npm run dev
```

Open <http://localhost:3000>.

### Environment variables

| Variable                     | Purpose                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_WORDPRESS_URL`  | WordPress URL, e.g. `https://backend-domain.com`                                                             |
| `FAUST_SECRET_KEY`           | Secret from WordPress → Settings → Faust (previews, auth)                                                    |
| `NEXT_PUBLIC_SITE_URL`       | Public URL of this frontend (canonical, `og:url`, sitemap)                                                   |
| `REVALIDATE_SECRET`          | Shared with the backend; protects `/api/revalidate`                                                          |
| `NEXT_PUBLIC_PIRSCH_CODE`    | Pirsch analytics code. Unset = no tracking                                                                   |
| `CMS_COMPONENTS_OUTPUT_PATH` | Where `npm run build:cms` writes, normally `<sdv-backend>/web/app/themes/headless/resources/frontend-assets` |
| `CMS_COMPONENTS_THEME_PATH`  | Path to the backend theme                                                                                    |

All variables are listed with placeholder values in `.env.example`.

## Scripts

| Command                       | What it does                                           |
| ----------------------------- | ------------------------------------------------------ |
| `npm run dev`                 | Dev server on :3000                                    |
| `npm run build` / `npm start` | Production build / serve it                            |
| `npm run lint`                | ESLint (`npx eslint <paths>` for specific files)       |
| `npm run generate`            | Refresh `possibleTypes.json` from the WordPress schema |
| `npm run build:cms`           | Build the CMS component bundle (Vite)                  |
| `npm run deploy`              | `git push` and follow the GitHub Actions run           |

## Project structure

```
pages/            Next.js routes
  [...wordpressNode].js   Catch-all, resolves WordPress URIs via Faust
  api/revalidate.js       On-demand ISR, called by the backend on save
  api/icon.js             Generated favicons/app icons
  sitemap.xml.js, preview.js
wp-templates/     Faust templates (front-page, page, single, single-work, single-event)
wp-blocks/        Gutenberg block components; views.js is also exported to the CMS
components/       Shared UI (Header, Footer, Seo, Figure, MediaFigure, …)
fragments/        GraphQL fragments (Media, Seo, Link, layout/general settings)
helpers/          Fonts, analytics, utils
styles/           Global CSS, variables, grid
cms/              Entry + exporters for the CMS bundle (components, GraphQL, fonts)
```

## How it fits together

### Content and templates

Faust resolves each URI against WordPress and picks a template from `wp-templates/`. Keep the imports in `wp-templates/index.js` **static**: Faust's `WordPressTemplate` renders nothing during SSR for templates loaded with `dynamic()`.

Blocks are rendered through `wp-blocks/`. Images are queried with `MediaFragment` and rendered with `MediaFigure`, which falls back to `Figure`. An image attachment with `videoFields.videoUrl` is treated as a video poster.

### Schema changes in the backend

After adding ACF field groups or interfaces in the backend, run `npm run generate` and commit `possibleTypes.json`. Interface fragments (e.g. `... on WithAcfSeoFields`) need it.

For curl testing, use `https://backend-domain.com/index.php?graphql` (`/graphql` gets redirected by Faust).

### Revalidation

Pages are statically generated. When content, menus or settings are saved, the backend queues the affected paths and sends one `POST /api/revalidate` (header `x-revalidate-secret`, body `{ "paths": [...] }`) on shutdown. The frontend regenerates at most 6 pages at a time.

### SEO

`components/Seo` renders head tags from `Seo.fragments.settings` (RootQuery) and `Seo.fragments.node` (ContentNode). `robots.txt` is proxied from WordPress.

## CMS components

The block views in `wp-blocks/views.js`, together with the site CSS, block GraphQL queries and fonts, are bundled with Vite (`vite.config.js`, entry `cms/cmsComponent.js`). The backend theme uses the bundle so blocks look the same in the editor as on the site.

**Locally:** with `CMS_COMPONENTS_OUTPUT_PATH` pointing to the theme, run `npm run build:cms` and then build the theme as usual.

**In CI:** every push to `main` or `production` runs `.github/workflows/cms-components.yml`, which builds the bundle and publishes it as a GitHub release `cms-<short sha>` (a pre-release on `main`). The backend pins a release in its own `cms-components.lock`:

```bash
# in sdv-backend
yarn cms:bump   # pins the latest release and commits the lock file
```

Deployer downloads the pinned bundle during deploy and fails if the theme imports files the bundle lacks. **Publish the frontend before deploying a backend change that depends on new block code.**

## Deployment

The Next.js app is built and hosted by a separate party, straight from this repo's `origin` (`ProduktionProduktion/sdv-frontend`). Pushing to `origin` is how the frontend gets deployed. There is no deploy step in this repo apart from the CMS bundle.

`npm run deploy` pushes the current branch and follows the CMS components workflow with `gh run watch`.

## Notes

- This is Next.js 16. APIs and conventions differ from older versions. Check `node_modules/next/dist/docs/` before relying on memory (see `AGENTS.md`).
- `AGENTS.md` holds notes for coding agents; its top block is rewritten by `next dev`.
