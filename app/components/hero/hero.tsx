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
		<main className='relative min-h-svh w-screen overflow-hidden'>
			<SplashCursor
				containerClassName='min-h-svh w-screen'
				usePrimaryColors={true}
			>
				<div
					className={classNames('relative min-h-svh', merryWeather.className)}
				>
					<div className='absolute top-[20%] md:top-[40%] max-w-5xl flex-col space-y-4 justify-center px-8 md:px-24 lg:ml-14'>
						<h1 className='text-2xl font-medium md:mr-4 md:text-4xl'>
							Welcome to my{' '}
							<span className='font-bold'>personal portfolio — </span> an{' '}
							<span className='italic border-b border-b-primary-500'>
								engineering
							</span>{' '}
							playground on the web.
						</h1>
						<section className='relative z-10'>
							<p className='text-base text-justify'>
								I&apos;m Sidali DJEGHBAL — an AI Engineering undergrad and
								full-stack developer, I build accessible, scalable web platforms
								that matter. Right now, I'm a Full-Stack Engineer at Algerian
								Tech Makers, developing the official website and CMS for{' '}
								<a
									href='https://bunian.online'
									className='underline-magical'
									target='_blank'
									rel='noreferrer'
									data-skip-splash-cursor
								>
									Bunian
								</a>
								.
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
									<a
										href='/static/pdf/resume.pdf'
										download
										aria-label='Download CV'
										data-skip-splash-cursor
										className='inline-flex items-center gap-2 rounded-full border border-primary-500 px-4 py-2 ml-2 text-primary-500 hover:bg-primary-500 hover:text-white transition-colors duration-200 dark:hover:text-black'
									>
										<DownloadIcon />
										Download CV
									</a>
								</div>
							</div>
							<div className='hidden h-14 border-l border-gray-300 md:block' />
							<div
								className='flex flex-wrap gap-x-3 gap-y-1'
								data-skip-splash-cursor
							>
								<Link href='/projects'>/projects</Link>
								<Link href='/uses'>/uses</Link>
								<Link href='/stats'>/stats</Link>
							</div>
						</section>
					</div>
				</div>
			</SplashCursor>
		</main>
	);
}
