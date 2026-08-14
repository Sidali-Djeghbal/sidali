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
							<span className='font-bold'>personal portfolio — </span> or, as I
							like to call it, my{' '}
							<span className='italic border-b border-b-primary-500'>
								playground
							</span>{' '}
							on the web.
						</h1>
						<section className='relative z-10'>
							<p className='text-base text-justify'>
								I&apos;m Sidali DJEGHBAL — an AI Engineer Undergrad and
								full-stack developer. I build web platforms that matter —
								intelligent, accessible, and engineered to scale. Right now I
								work as a Full-Stack Engineer at Algerian Tech Makers, building
								the official website and CMS for{' '}
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
						<section className='relative z-10 flex space-x-4 items-center text-sm'>
							<div>
								<p>More about me: </p>
								<div className='flex -ml-2'>
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
								<a
									href='/static/pdf/resume.pdf'
									download
									aria-label='Download CV'
									data-skip-splash-cursor
									className='inline-flex items-center gap-2 rounded-full border border-primary-500 px-4 py-2 mt-3 text-primary-500 hover:bg-primary-500 hover:text-white transition-colors duration-200 dark:hover:text-black'
								>
									<DownloadIcon />
									Download CV
								</a>
							</div>
							<div className='h-14 border-l border-gray-300' />
							<div
								className='flex flex-wrap space-x-3 space-y-1'
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
