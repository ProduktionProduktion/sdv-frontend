import {defineConfig} from "vite"
import esbuild from 'rollup-plugin-esbuild'

export default defineConfig({
    build: {
      lib: {
        entry: 'cms/wordpressComponent.js',
        name: 'wordpressComponent',
        fileName: 'wordpressComponent.min',
        formats: ['es']
      },
      outDir: 'cms/dist',
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        plugins: [
          esbuild({
            loader: 'jsx',
            jsx: 'automatic',
            jsxImportSource: 'react'
          })
        ],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'ReactJSXRuntime'
          }
        }
      }
    }
  });