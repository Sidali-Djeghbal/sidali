import Projects from 'app/projects/projects';
import type { Metadata } from 'next';
import { Fragment } from 'react';
import Header from '../components/header';

const siteUrl = 'https://sidali-djeghbal.dev';

export const metadata: Metadata = {
	title: 'Projects',
	description:
		'Explore my selected projects — full-stack apps, AI tools, open-source contributions, and web platforms built with modern technologies.',
	alternates: {
		canonical: `${siteUrl}/projects`,
	},
};

export default function Page() {
	return (
		<Fragment>
			<Header title='Projects' />
			<div className='space-y-2 md:space-y-5 '>
				<p className='text-lg leading-7 text-gray-500 dark:text-gray-400'>
					Here are some of my selected projects worth sharing.
				</p>
			</div>
			<Projects />
		</Fragment>
	);
}
