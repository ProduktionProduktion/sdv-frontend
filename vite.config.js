import { defineConfig, loadEnv, runnerImport } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import esbuild from 'rollup-plugin-esbuild';

const alias = { '@': fileURLToPath(new URL('./', import.meta.url)) };
const jsx = () => esbuild({ loader: 'jsx', jsx: 'automatic', jsxImportSource: 'react' });

const emptyCss = {
    name: 'empty-css',
    enforce: 'pre',
    resolveId: (id) => (/\.css$/.test(id) ? '\0empty-css' : null),
    load: (id) => (id === '\0empty-css' ? 'export default {}' : null),
};

const graphqlExport = (out) => ({
    name: 'graphql-export',
    apply: 'build',
    async closeBundle() {
        const { module } = await runnerImport('./cms/graphqlExport.mjs', {
            configFile: false,
            logLevel: 'error',
            resolve: { alias },
            environments: { inline: { resolve: { noExternal: ['@apollo/client'], mainFields: ['module'] } } },
            plugins: [emptyCss, jsx()],
        });
        const files = module.exportBlockQueries(out);
        // console.log(`\n    Exported ${files.length} block queries into:\n    ${out}\n`);
    },
});

// /Users/johanhemgren/Sites/sdv-backend/app/public/web/app/themes/headless/resources/scripts/fromNextJs
// console.log('import.meta.env.CMS_COMPONENTS_OUTPUT_PATH', import.meta.env.CMS_COMPONENTS_OUTPUT_PATH);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const outDir = `${env.CMS_COMPONENTS_OUTPUT_PATH}/dist`;
    const themePath = `${env.CMS_COMPONENTS_THEME_PATH}`;

    //     console.log(`
    //     Bundled into:
    //     ${outDir}

    //     …now go to
    //     ${themePath} and run:
    //     yarn build
    //   `);

    return {
        publicDir: false,
        build: {
            lib: {
                entry: 'cms/cmsComponent.js',
                name: 'cmsComponent',
                fileName: 'cmsComponent.min',
                formats: ['es'],
            },
            outDir,
            // outDir: 'cms/dist',
            rollupOptions: {
                external: ['react', 'react-dom', 'react/jsx-runtime'],
                plugins: [jsx()],
                output: {
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM',
                        'react/jsx-runtime': 'ReactJSXRuntime',
                    },
                },
            },
        },
        plugins: [graphqlExport(`${env.CMS_COMPONENTS_OUTPUT_PATH}/graphql/blocks`)],
        resolve: {
            alias: {
                ...alias, // Alias for src folder
            },
        },
    };
});
