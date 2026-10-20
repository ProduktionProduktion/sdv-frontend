import { withFaust, getWpHostname } from "@faustwp/core";
import { createSecureHeaders } from "next-secure-headers";

const nextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  partialPrefetching: true,
  allowedDevOrigins: ['172.20.20.173'],
  images: {
		remotePatterns: [{
			protocol: 'https',
			hostname: getWpHostname(),
		},
		{	
			protocol: 'http',
			hostname: getWpHostname(),
		}],
		dangerouslyAllowLocalIP: true,
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: createSecureHeaders({
					xssProtection: false,
				}),
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
