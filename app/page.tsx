import type { Metadata } from 'next';
import Hero from './components/hero/hero';

const siteUrl = 'https://sidali-djeghbal.dev';

export const metadata: Metadata = {
	alternates: {
		canonical: siteUrl,
	},
};

export default function Home() {
	return <Hero />;
}
