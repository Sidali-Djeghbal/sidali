const siteUrl = 'https://sidali-djeghbal.dev';

const personSchema = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: 'Sidali DJEGHBAL',
	url: siteUrl,
	image: `${siteUrl}/og-image.png`,
	jobTitle: 'AI Engineering Undergrad & Full-Stack Developer',
	description:
		'AI Engineering Undergrad and Full-Stack Developer building accessible, scalable web platforms that matter.',
	email: 'mailto:connect@sidali-djeghbal.dev',
	sameAs: [
		'https://www.linkedin.com/in/sidali-djeghbal',
		'https://github.com/sidali-djeghbal',
	],
	knowsAbout: [
		'Artificial Intelligence',
		'Full-Stack Web Development',
		'Accessible Web Design',
		'Scalable Architecture',
		'Software Engineering',
	],
};

const websiteSchema = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: 'Sidali DJEGHBAL',
	url: siteUrl,
	description:
		'AI Engineering Undergrad & Full-Stack Developer building accessible, scalable web platforms that matter.',
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
