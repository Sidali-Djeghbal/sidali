import Analytics from 'app/components/analytics/analytics';
import LenisProvider from 'app/components/providers/LenisProvider';
import ThemeProvider from 'app/components/providers/ThemeProvider';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import ThemeSwitch from './components/layouts/theme-switch/theme-switch';
import { mukta } from './fonts';
import './tailwind.css';

export const metadata: Metadata = {
	title: {
		template: '%s | Sidali DJEGHBAL',
		default: 'Sidali DJEGHBAL',
	},
	description:
		'AI Engineer Undergrad | Full-Stack Developer building scalable software and intelligent tools.',
	metadataBase: new URL('https://sidali-djeghbal.dev'),
};

interface RootLayoutProps {
	children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang='en' suppressHydrationWarning className={mukta.className}>
			<head>
				<link
					rel='apple-touch-icon'
					sizes='180x180'
					href='/static/favicons/apple-touch-icon.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='32x32'
					href='/static/favicons/favicon-32x32.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='16x16'
					href='/static/favicons/favicon-16x16.png'
				/>
				<link
					rel='icon'
					type='image/x-icon'
					href='/static/favicons/favicon.ico'
				/>
				<meta name='msapplication-TileColor' content='#000000' />
				<meta name='theme-color' content='#000000' />
			</head>
			<body className='bg-white text-black antialiased dark:bg-black dark:text-white selection:bg-primary-500 selection:text-white dark:selection:text-black'>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					themes={['dark', 'light']}
				>
					<LenisProvider>
						<ThemeSwitch />
						{children}
					</LenisProvider>
					{process.env.NODE_ENV === 'production' && <Analytics />}
				</ThemeProvider>
			</body>
		</html>
	);
}
