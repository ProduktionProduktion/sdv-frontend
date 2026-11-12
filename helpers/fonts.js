import localFont from 'next/font/local';
import { Work_Sans, DM_Mono } from 'next/font/google';

const body = localFont({
    src: [
        {
            path: '../public/fonts/NaNTragedyText-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/fonts/NaNTragedyText-Italic.woff2',
            weight: '400',
            style: 'italic',
        },
        {
            path: '../public/fonts/NaNTragedyText-Bold.woff2',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../public/fonts/NaNTragedyText-BoldItalic.woff2',
            weight: '700',
            style: 'italic',
        },
    ],
    variable: '--font-body',
    // Not used above the fold on the front page; skip preloading so the 4 files (~210 KB)
    // don't compete with the LCP image. Still discovered from CSS when used.
    preload: false,
});

const heading = Work_Sans({
    subsets: ['latin'],
    // weight: ['600'],
    variable: '--font-heading',
});

const mono = DM_Mono({
    subsets: ['latin'],
    weight: ['300', '500'],
    variable: '--font-mono',
    preload: false,
});

const fonts = {
    body,
    heading,
    mono,
};

export const font = (fontType = 'body', method = 'className') => fonts?.[fontType]?.[method] ?? null;
