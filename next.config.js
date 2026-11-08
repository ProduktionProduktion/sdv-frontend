import { withFaust, getWpHostname } from '@faustwp/core';
import { createSecureHeaders } from 'next-secure-headers';

const nextConfig = {
    reactStrictMode: true,
    cacheComponents: true,
    partialPrefetching: true,
    allowedDevOrigins: ['172.20.20.173'],
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: getWpHostname(),
            },
            {
                protocol: 'http',
                hostname: getWpHostname(),
            },
        ],
        dangerouslyAllowLocalIP: true,
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: createSecureHeaders({
                    xssProtection: false,
                }),
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: '/robots.txt',
                destination: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/robots.txt`,
            },
        ];
    },
    // exportPathMap: function () {
    // 	return {
    // 		'/': { page: '/' },
    // 		// '/blog/nextjs': { page: '/blog/[post]/comment/[id]' },        // wrong
    // 		'/blog/nextjs/comment/1': { page: '/blog/[post]/comment/[id]' }, // correct
    // 	};
    // },
};

export default withFaust(nextConfig);
