import { Fragment } from 'react';
import Header from '../components/header';
import { components } from '../components/mdx';
import Content from './content.mdx';
import UsesTitle from './uses-title';

export const metadata = {
	title: 'Uses',
	description: 'What I use',
};

export default function Page() {
	return (
		<Fragment>
			<Header title='Uses' />
			<UsesTitle />
			<Content components={components} />
		</Fragment>
	);
}
