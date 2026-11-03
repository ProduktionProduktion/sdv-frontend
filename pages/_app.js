import { useRouter } from 'next/router';
import { FaustProvider } from '@faustwp/core';
import { WordPressBlocksProvider } from '@faustwp/blocks';
import { font } from '@/helpers/fonts';
import { RouteProgress } from '@/components/RouteProgress';
import blocks from '../wp-blocks';
import '../faust.config.js';

/**
 * TODO: Export these (↓) into WP
 */
import '@/styles/globals.css';
import '@/styles/grid.css';
import '@/styles/modules.css';

export default function App({ Component, pageProps }) {
    const router = useRouter();
    const fonts = {
        body: font('body', 'style'),
        heading: font('heading', 'style'),
        mono: font('mono', 'style'),
    };

    return (
        <FaustProvider pageProps={pageProps}>
            <style jsx global>{`
                :root {
                    --font-body: ${fonts.body.fontFamily};
                    --font-heading: ${fonts.heading.fontFamily};
                    --font-navigation: ${fonts.heading.fontFamily};
                    --font-mono: ${fonts.mono.fontFamily};
                }
            `}</style>
            <RouteProgress />
            <WordPressBlocksProvider config={blocks}>
                <Component {...pageProps} key={router.asPath} />
            </WordPressBlocksProvider>
        </FaustProvider>
    );
}
