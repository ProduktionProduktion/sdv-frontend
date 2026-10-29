import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import esbuild from 'rollup-plugin-esbuild';

// /Users/johanhemgren/Sites/sdv-backend/app/public/web/app/themes/headless/resources/scripts/fromNextJs
// console.log('import.meta.env.CMS_COMPONENTS_OUTPUT_PATH', import.meta.env.CMS_COMPONENTS_OUTPUT_PATH);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const outDir = `${env.CMS_COMPONENTS_OUTPUT_PATH}/dist`;
    const themePath = `${env.CMS_COMPONENTS_THEME_PATH}`;

    console.log(`
    Bundled into: 
    ${outDir}

    …now go to 
    ${themePath} and run: 
    yarn build
  `);

    return {
        build: {
            lib: {
                entry: 'cms/wordpressComponent.js',
                name: 'wordpressComponent',
                fileName: 'wordpressComponent.min',
                formats: ['es'],
            },
            outDir,
            // outDir: 'cms/dist',
            rollupOptions: {
                external: ['react', 'react-dom', 'react/jsx-runtime'],
                plugins: [
                    esbuild({
                        loader: 'jsx',
                        jsx: 'automatic',
                        jsxImportSource: 'react',
                    }),
                ],
                output: {
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM',
                        'react/jsx-runtime': 'ReactJSXRuntime',
                    },
                },
            },
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./', import.meta.url)), // Alias for src folder
            },
        },
    };
});
