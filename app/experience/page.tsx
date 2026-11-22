import classNames from 'classnames';
import type { Metadata } from 'next';
import { Fragment } from 'react';
import Header from '../components/header';
import { DownloadIcon } from '../components/layouts/icons/download-icon';
import { merryWeather } from '../fonts';

const siteUrl = 'https://sidali-djeghbal.dev';
const pageDescription =
	'Work experience, open-source maintenance, and computer science education of Sidali DJEGHBAL — Frontend & UI Engineer.';

export const metadata: Metadata = {
	title: 'Experience',
	description: pageDescription,
	alternates: {
		canonical: `${siteUrl}/experience`,
	},
	openGraph: {
		type: 'website',
		url: `${siteUrl}/experience`,
		siteName: 'Sidali DJEGHBAL',
		title: 'Experience | Sidali DJEGHBAL',
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
		title: 'Experience | Sidali DJEGHBAL',
		description: pageDescription,
		images: ['/og-image.png'],
	},
};

type ExperienceEntry = {
	organization: string;
	organizationUrl?: string;
	parentOrganization?: {
		name: string;
		url: string;
	};
	role: string;
	location: string;
	period: string;
	highlights: string[];
};

const experiences: ExperienceEntry[] = [
	{
		organization: 'Algerian Tech Makers',
		parentOrganization: {
			name: 'Bunian',
			url: 'https://bunian.online',
		},
		role: 'Frontend Engineer (Full Stack)',
		location: 'Remote',
		period: 'Mar 2026 – Present',
		highlights: [
			'Architected a responsive, bidirectional (RTL/LTR) Next.js public web platform for Bunian using React Server Components, structured JSON-LD metadata, and dynamic sitemaps to maximize search visibility and mobile performance.',
			'Built a custom React-Admin CMS and drag-and-drop block newsletter composer with live template previews, image uploads, and quota tracking, enabling non-technical staff to publish campaigns independently.',
		],
	},
	{
		organization: 'TechGeeks',
		role: 'Frontend Engineer',
		location: 'Hybrid',
		period: 'Oct 2024 – Jan 2026',
		highlights: [
			'Engineered the SolveIt 3.0 interactive learning interface featuring an embedded code editor, 3D dashboard, and side-by-side Blockly-to-C visual code generator.',
			'Built step-by-step algorithm walkthroughs and user progress tracking for a competitive programming platform.',
		],
	},
	{
		organization: 'Daad Blockly',
		organizationUrl: 'https://github.com/daadLang/daad-blockly',
		role: 'Author & Maintainer',
		location: 'Remote · Open Source',
		period: 'May 2025 – Aug 2025',
		highlights: [
			'Designed a custom visual-to-source code generator and 50+ custom Blockly definitions backed by a DOM-free core state layer unit-tested headlessly with Vitest.',
			'Automated multi-OS desktop packaging via electron-builder and GitHub Actions release pipelines.',
		],
	},
];

const coursework = [
	'Web Programming',
	'Cross-Platform Mobile Development',
	'Software Engineering & Design Patterns',
	'Compilers & Code Generation',
	'Databases',
	'Operating Systems',
];

export default function ExperiencePage() {
	return (
		<Fragment>
			<Header title='Experience' />
			<div className='flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
				<div className='space-y-2'>
					<h1 className='text-2xl font-bold md:text-4xl'>
						Frontend &amp; UI Engineer
					</h1>
					<p className='max-w-2xl text-lg leading-7 text-gray-600 dark:text-gray-400'>
						Shipping interactive React, Next.js, and TypeScript platforms,
						visual block editors, and custom CMS tools for remote teams.
					</p>
					<p className='text-sm text-gray-600 dark:text-gray-400'>
						Algeria (UTC+1) · Available for remote frontend roles
					</p>
				</div>
				<a
					href='/Sidali_Djeghbal_Frontend_Engineer.pdf'
					download='Sidali_Djeghbal_Frontend_Engineer.pdf'
					className='inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-5 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:border-black hover:bg-gray-100 hover:text-black dark:border-gray-800 dark:bg-zinc-900/60 dark:text-gray-200 dark:hover:border-white dark:hover:bg-zinc-800/80 dark:hover:text-white'
				>
					<DownloadIcon size={15} aria-hidden='true' />
					<span>Download CV (PDF)</span>
				</a>
			</div>

			<section className='mt-16 sm:mt-24'>
				<div className='grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16'>
					<div className='max-w-sm'>
						<p className='mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-gray-600 dark:text-gray-400'>
							Career
						</p>
						<h2
							className={classNames(
								'text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl dark:text-white',
								merryWeather.className,
							)}
						>
							Experience
						</h2>
						<p className='mt-4 max-w-xs text-sm leading-6 text-gray-600 dark:text-gray-400'>
							Production web platforms, interactive learning environments, and
							open-source developer tools.
						</p>
					</div>

					<div className='divide-y divide-gray-200 border-t border-gray-200 dark:divide-gray-800 dark:border-gray-800'>
						{experiences.map((item) => (
							<article key={item.organization} className='py-7 sm:py-8'>
								<div className='flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between'>
									<div>
										<h3 className='text-lg font-semibold tracking-tight text-gray-950 dark:text-white'>
											{item.organizationUrl ? (
												<a
													href={item.organizationUrl}
													target='_blank'
													rel='noreferrer'
													className='underline-magical'
												>
													{item.organization}
												</a>
											) : (
												item.organization
											)}
											{item.parentOrganization && (
												<span className='ml-2 text-xs font-normal text-gray-600 dark:text-gray-400'>
													(Tech branch of{' '}
													<a
														href={item.parentOrganization.url}
														target='_blank'
														rel='noreferrer'
														className='underline-magical font-medium text-gray-950 dark:text-white'
													>
														{item.parentOrganization.name}
													</a>
													)
												</span>
											)}
										</h3>
										<p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
											{item.role}
										</p>
									</div>
									<div className='text-xs text-gray-600 sm:text-right dark:text-gray-400'>
										<p className='font-mono'>{item.period}</p>
										<p>{item.location}</p>
									</div>
								</div>

								<ul className='mt-4 space-y-2.5 text-sm leading-6 text-gray-600 dark:text-gray-400'>
									{item.highlights.map((bullet) => (
										<li key={bullet} className='flex gap-3'>
											<span
												aria-hidden='true'
												className='mt-2.5 size-1 shrink-0 rounded-full bg-gray-400 dark:bg-gray-600'
											/>
											<span>{bullet}</span>
										</li>
									))}
								</ul>
							</article>
						))}
					</div>
				</div>

				<div className='mt-24 sm:mt-32'>
					<div className='grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16'>
						<div className='max-w-sm'>
							<p className='mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-gray-600 dark:text-gray-400'>
								Academic
							</p>
							<h2
								className={classNames(
									'text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl dark:text-white',
									merryWeather.className,
								)}
							>
								Education
							</h2>
							<p className='mt-4 max-w-xs text-sm leading-6 text-gray-600 dark:text-gray-400'>
								Foundations in computer science, compilers, systems, and
								artificial intelligence.
							</p>
						</div>

						<div className='border-t border-gray-200 pt-7 dark:border-gray-800'>
							<div className='flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between'>
								<div>
									<h3 className='text-lg font-semibold tracking-tight text-gray-950 dark:text-white'>
										University of 8th May 1945 at Guelma, Algeria
									</h3>
									<p className='mt-1 text-sm font-medium text-gray-700 dark:text-gray-300'>
										State Engineer Degree (Ingénieur d&apos;État — Master&apos;s
										Equivalent) in Computer Science (AI Specialization)
									</p>
								</div>
								<p className='shrink-0 font-mono text-xs text-gray-600 dark:text-gray-400'>
									Oct 2023 – Expected Jun 2028 (4th Year)
								</p>
							</div>

							<div className='mt-5'>
								<p className='mb-2.5 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400'>
									Relevant Coursework
								</p>
								<div className='flex flex-wrap gap-2'>
									{coursework.map((course) => (
										<span
											key={course}
											className='inline-flex items-center whitespace-nowrap rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-gray-800 dark:text-gray-300'
										>
											{course}
										</span>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</Fragment>
	);
}
