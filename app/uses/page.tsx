import type { Metadata } from 'next';
import { Fragment } from 'react';
import Header from '../components/header';
import { components } from '../components/mdx';
import Content from './content.mdx';
import SkillsSection from './skills-section';
import UsesTitle from './uses-title';

const siteUrl = 'https://sidali-djeghbal.dev';

export const metadata: Metadata = {
	title: 'Uses',
	description:
		'The tools, hardware, and software I use daily for development — editors, browsers, frameworks, and my tech stack.',
	alternates: {
		canonical: `${siteUrl}/uses`,
	},
};

export default function Page() {
	return (
		<Fragment>
			<Header title='Uses' />
			<UsesTitle />
			<Content components={components} />
			<SkillsSection />
		</Fragment>
	);
}
