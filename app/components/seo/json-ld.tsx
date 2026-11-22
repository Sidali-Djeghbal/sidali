const siteUrl = 'https://sidali-djeghbal.dev';

const personSchema = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: 'Sidali DJEGHBAL',
	url: siteUrl,
	image: `${siteUrl}/og-image.png`,
	jobTitle: 'Frontend & UI Engineer',
	description:
		'Frontend & UI Engineer specializing in interactive React, Next.js, and TypeScript applications, data-intensive dashboards, and accessible multilingual/RTL web interfaces.',
	email: 'mailto:connect@sidali-djeghbal.dev',
	address: {
		'@type': 'PostalAddress',
		addressCountry: 'Algeria',
	},
	worksFor: {
		'@type': 'Organization',
		name: 'Algerian Tech Makers',
		parentOrganization: {
			'@type': 'Organization',
			name: 'Bunian',
			url: 'https://bunian.online',
		},
	},
	alumniOf: {
		'@type': 'CollegeOrUniversity',
		name: 'University of 8th May 1945 at Guelma',
	},
	knowsLanguage: ['en', 'fr', 'ar'],
	sameAs: [
		'https://www.linkedin.com/in/sidali-djeghbal',
		'https://github.com/sidali-djeghbal',
	],
	knowsAbout: [
		'Frontend Engineering',
		'UI Engineering',
		'React 19',
		'Next.js',
		'TypeScript',
		'RTL/LTR Web Interfaces',
		'WCAG Accessibility',
		'Vitest',
		'Playwright',
		'Geospatial Web Applications',
		'Visual Block Editors',
	],
};

const websiteSchema = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: 'Sidali DJEGHBAL',
	url: siteUrl,
	description:
		'Frontend & UI Engineer specializing in interactive React, Next.js, and TypeScript applications, data-intensive dashboards, and accessible multilingual/RTL web interfaces.',
	inLanguage: 'en',
	author: {
		'@type': 'Person',
		name: 'Sidali DJEGHBAL',
		url: siteUrl,
	},
};

export default function JsonLd() {
	return (
		<>
			<script
				type='application/ld+json'
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data must be injected as raw JSON.
				dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
			/>
			<script
				type='application/ld+json'
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data must be injected as raw JSON.
				dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
			/>
		</>
	);
}
