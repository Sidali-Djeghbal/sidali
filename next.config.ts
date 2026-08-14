import path from 'node:path';
import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const umami_url = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_URL ?? '';

const nextConfig: NextConfig = {
	reactStrictMode: true,
	pageExtensions: ['ts', 'tsx'],
	reactCompiler: true,
	images: {
		unoptimized: true,
		dangerouslyAllowSVG: true,
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	turbopack: {
		root: path.join(__dirname, '..'),
	},
	experimental: {
		turbopackFileSystemCacheForDev: true,
	},
	async rewrites() {
		return [
			{
				source: '/umami.js',
				destination: `${umami_url}/script.js`,
			},
			{
				source: '/api/send',
				destination: `${umami_url}/api/send`,
			},
		];
	},
};

const withMDX = createMDX({
	options: {
		providerImportSource: '',
	},
});

export default withMDX(nextConfig);

import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();
