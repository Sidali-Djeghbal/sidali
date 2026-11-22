import GithubCta from 'app/projects/github-cta';
import Projects from 'app/projects/projects';
import type { Metadata } from 'next';
import { Fragment } from 'react';
import Header from '../components/header';

const siteUrl = 'https://sidali-djeghbal.dev';
const pageDescription =
	'Explore my selected projects — interactive React and Next.js applications, geospatial workspaces, visual block editors, custom CMS tools, and cross-platform apps.';

export const metadata: Metadata = {
	title: 'Projects',
	description: pageDescription,
	alternates: {
		canonical: `${siteUrl}/projects`,
	},
	openGraph: {
		type: 'website',
		url: `${siteUrl}/projects`,
		siteName: 'Sidali DJEGHBAL',
		title: 'Projects | Sidali DJEGHBAL',
		description: pageDescription,
		locale: 'en_US',
		images: [
			{
				url: '/og-image.png',
				width: 1200,
				height: 630,
				alt: 'Sidali DJEGHBAL — Frontend & UI Engineer',
				type: 'image/png',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Projects | Sidali DJEGHBAL',
		description: pageDescription,
		images: ['/og-image.png'],
	},
};

export default function Page() {
	return (
		<Fragment>
			<Header title='Projects' />
			<h1 className='sr-only'>Projects</h1>
			<div className='space-y-2 md:space-y-5 '>
				<p className='text-lg leading-7 text-gray-500 dark:text-gray-400'>
					Here are some of my selected projects worth sharing.
				</p>
			</div>
			<Projects />
			<GithubCta />
		</Fragment>
	);
}
