import localFont from 'next/font/local';
import { Work_Sans, DM_Mono, Fraunces } from 'next/font/google';

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
});

const fonts = {
    body,
    heading,
    mono,
};

export const font = (fontType = 'body', method = 'className') => fonts?.[fontType]?.[method] ?? null;
