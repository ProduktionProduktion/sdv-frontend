import { pascalToKebab } from '@/helpers';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document(props) {
    /* TODO: Figure out a way to add templte classes to body */
    const pageProps = props?.__NEXT_DATA__?.props?.pageProps;
    const typeName = pageProps?.__SEED_NODE__?.__typename;
    const viewTypeClass = typeName ? pascalToKebab(typeName) : undefined;

    return (
        <Html lang="en">
            <Head />
            <body className={[viewTypeClass].filter(Boolean).join(' ')}>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
