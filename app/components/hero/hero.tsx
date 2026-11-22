import classNames from 'classnames';
import Link from 'next/link';
import { merryWeather } from '../../fonts';
import { AtSignIcon } from '../layouts/icons/at-sign-icon';
import { DownloadIcon } from '../layouts/icons/download-icon';
import { GithubIcon } from '../layouts/icons/github-icon';
import { LinkedinIcon } from '../layouts/icons/linkedin-icon';
import SplashCursor from '../splash-cursor';

export default function Hero() {
	return (
		<main className='relative min-h-svh w-screen overflow-x-hidden'>
			<SplashCursor
				containerClassName='min-h-svh w-screen'
				usePrimaryColors={true}
			>
				<div
					className={classNames(
						'relative flex min-h-svh items-center py-16 md:py-24',
						merryWeather.className,
					)}
				>
					<div className='max-w-5xl flex-col space-y-4 justify-center px-8 md:px-24 lg:ml-14'>
						<h1 className='text-2xl font-medium md:mr-4 md:text-4xl'>
							Welcome to my{' '}
							<span className='font-bold'>personal portfolio — </span> an{' '}
							<span className='italic border-b border-b-primary-500'>
								engineering
							</span>{' '}
							playground on the web.
						</h1>
						<section className='relative z-10 space-y-2'>
							<p className='text-base text-left md:text-justify'>
								I&apos;m Sidali DJEGHBAL — a Software Engineer
								(frontend-focused) with full-stack experience, specializing in
								interactive React, Next.js, and TypeScript applications,
								data-intensive dashboards, and accessible multilingual/RTL
								interfaces.
							</p>
							<p className='text-xs text-gray-600 dark:text-gray-400'>
								Algeria (UTC+1) · Available for remote software &amp; frontend
								roles
							</p>
						</section>
						<section className='relative z-10 flex flex-col gap-6 items-start text-sm md:flex-row md:flex-wrap md:items-center'>
							<div>
								<p>More about me: </p>
								<div className='flex flex-wrap items-center -ml-2'>
									<Link
										href='https://www.linkedin.com/in/sidali-djeghbal'
										target='_blank'
										rel='noreferrer'
										aria-label='linkedin'
										data-skip-splash-cursor
									>
										<LinkedinIcon className='h-9 w-9' />
									</Link>
									<Link
										href='https://github.com/sidali-djeghbal'
										target='_blank'
										rel='noreferrer'
										aria-label='github'
										data-skip-splash-cursor
									>
										<GithubIcon className='h-9 w-9' />
									</Link>
									<Link
										href='mailto:connect@sidali-djeghbal.dev'
										aria-label='email'
										rel='noreferrer'
										data-skip-splash-cursor
									>
										<AtSignIcon className='h-9 w-9' />
									</Link>
								</div>
							</div>
							<div className='hidden h-14 border-l border-gray-300 md:block' />
							<div
								className='flex flex-wrap items-center gap-x-3 gap-y-1'
								data-skip-splash-cursor
							>
								<Link href='/projects'>/projects</Link>
								<Link href='/experience'>/experience</Link>
								<Link href='/uses'>/uses</Link>
								<Link href='/stats'>/stats</Link>
								<a
									href='/Sidali_Djeghbal_Frontend_Engineer.pdf'
									download='Sidali_Djeghbal_Frontend_Engineer.pdf'
									aria-label='Download CV (PDF)'
									className='inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1 text-xs font-medium transition-colors hover:border-primary-500 hover:bg-primary-500 hover:text-white dark:border-gray-700 dark:hover:text-black'
								>
									<DownloadIcon size={13} aria-hidden='true' />
									<span>CV</span>
								</a>
							</div>
						</section>
					</div>
				</div>
			</SplashCursor>
		</main>
	);
}
