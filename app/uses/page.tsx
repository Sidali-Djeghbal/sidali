import { Fragment } from 'react';
import Header from '../components/header';
import { CustomMDX } from '../components/mdx';
import { content } from './content';
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
			<CustomMDX source={content} />
		</Fragment>
	);
}
