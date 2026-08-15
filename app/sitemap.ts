const baseUrl = 'https://sidali-djeghbal.dev';

const routes = [
	{ route: '', changeFrequency: 'monthly', priority: 1 },
	{ route: 'projects', changeFrequency: 'monthly', priority: 0.9 },
	{ route: 'uses', changeFrequency: 'yearly', priority: 0.8 },
	{ route: 'stats', changeFrequency: 'weekly', priority: 0.6 },
] as const;

export default async function sitemap() {
	const lastModified = new Date().toISOString().split('T')[0];

	return routes.map(({ route, changeFrequency, priority }) => ({
		url: route === '' ? `${baseUrl}/` : `${baseUrl}/${route}`,
		lastModified,
		changeFrequency,
		priority,
	}));
}
