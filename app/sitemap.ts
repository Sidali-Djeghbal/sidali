export const baseUrl = 'https://sidali-djeghbal.dev';

export default async function sitemap() {
	const routes = ['', 'projects', 'stats', 'uses'].map((route) => ({
		url: route === '' ? `${baseUrl}/` : `${baseUrl}/${route}`,
		lastModified: new Date().toISOString().split('T')[0],
	}));

	return routes;
}
