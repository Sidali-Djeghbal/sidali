import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
		},
		sitemap: `https://sidali-djeghbal.dev/sitemap.xml`,
		host: `https://sidali-djeghbal.dev`,
	};
}
