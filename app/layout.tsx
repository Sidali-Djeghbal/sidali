import Analytics from 'app/components/analytics/analytics';
import LenisProvider from 'app/components/providers/LenisProvider';
import ThemeProvider from 'app/components/providers/ThemeProvider';
import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import ThemeSwitch from './components/layouts/theme-switch/theme-switch';
import JsonLd from './components/seo/json-ld';
import { mukta } from './fonts';
import './tailwind.css';

const siteUrl = 'https://sidali-djeghbal.dev';

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default:
			'Sidali DJEGHBAL | AI Engineering Undergrad & Full-Stack Developer',
		template: '%s | Sidali DJEGHBAL',
	},
	description:
		"I'm Sidali DJEGHBAL — an AI Engineering undergrad and full-stack developer building accessible, scalable web platforms that matter. Explore my projects, experience, and the tools I use.",
	applicationName: 'Sidali DJEGHBAL',
	authors: [{ name: 'Sidali DJEGHBAL', url: siteUrl }],
	creator: 'Sidali DJEGHBAL',
	publisher: 'Sidali DJEGHBAL',
	category: 'technology',
	keywords: [
		'Sidali DJEGHBAL',
		'sidali djeghbal',
		'AI engineering',
		'AI engineer',
		'full-stack developer',
		'full stack engineer',
		'web developer',
		'software engineer',
		'portfolio',
		'Algerian developer',
		'open source',
	],
	openGraph: {
		type: 'website',
		url: siteUrl,
		siteName: 'Sidali DJEGHBAL',
		title: 'Sidali DJEGHBAL | AI Engineering Undergrad & Full-Stack Developer',
		description:
			'AI Engineering Undergrad & Full-Stack Developer building accessible, scalable web platforms that matter.',
		locale: 'en_US',
		images: [
			{
				url: '/og-image.png',
				width: 1200,
				height: 630,
				alt: 'Sidali DJEGHBAL — AI Engineering Undergrad & Full-Stack Developer',
				type: 'image/png',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Sidali DJEGHBAL | AI Engineering Undergrad & Full-Stack Developer',
		description:
			'AI Engineering Undergrad & Full-Stack Developer building accessible, scalable web platforms that matter.',
		images: ['/og-image.png'],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	alternates: {
		canonical: siteUrl,
	},
	icons: {
		icon: [
			{
				url: '/static/favicons/favicon-32x32.png',
				sizes: '32x32',
				type: 'image/png',
			},
			{
				url: '/static/favicons/favicon-16x16.png',
				sizes: '16x16',
				type: 'image/png',
			},
			{ url: '/static/favicons/favicon.ico', type: 'image/x-icon' },
		],
		apple: [
			{
				url: '/static/favicons/apple-touch-icon.png',
				sizes: '180x180',
				type: 'image/png',
			},
		],
	},
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
};

interface RootLayoutProps {
	children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang='en' suppressHydrationWarning className={mukta.className}>
			<head>
				<meta name='msapplication-TileColor' content='#000000' />
				<meta name='theme-color' content='#000000' />
				<Script
					id='gtm-script'
					strategy='afterInteractive'
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Third-party analytics
					dangerouslySetInnerHTML={{
						__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-58JSZ9S4');`,
					}}
				/>
				<Script
					async
					src='https://www.googletagmanager.com/gtag/js?id=G-W5DR5CRNJK'
					strategy='afterInteractive'
				/>
				<Script
					id='gtag-config'
					strategy='afterInteractive'
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Third-party analytics config
					dangerouslySetInnerHTML={{
						__html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-W5DR5CRNJK');`,
					}}
				/>
			</head>
			<body className='bg-white text-black antialiased dark:bg-black dark:text-white selection:bg-primary-500 selection:text-white dark:selection:text-black'>
				<noscript>
					<iframe
						src='https://www.googletagmanager.com/ns.html?id=GTM-58JSZ9S4'
						height='0'
						width='0'
						style={{ display: 'none', visibility: 'hidden' }}
						title='Google Tag Manager'
					/>
				</noscript>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					themes={['dark', 'light']}
				>
					<LenisProvider>
						<ThemeSwitch />
						<JsonLd />
						{children}
					</LenisProvider>
					{process.env.NODE_ENV === 'production' && <Analytics />}
				</ThemeProvider>
			</body>
		</html>
	);
}
