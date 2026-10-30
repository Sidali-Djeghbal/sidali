'use client';

import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { GithubIcon } from '../components/layouts/icons/github-icon';

export default function GithubCta() {
	const prefersReducedMotion = useReducedMotion();

	return (
		<motion.div
			initial={{
				scale: prefersReducedMotion ? 1 : 0.95,
				opacity: 0,
				filter: prefersReducedMotion ? 'blur(0px)' : 'blur(2px)',
			}}
			animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
			transition={{
				duration: prefersReducedMotion ? 0.2 : 0.5,
				delay: prefersReducedMotion ? 0 : 0.2,
			}}
			className='flex flex-col items-center justify-center py-16 text-center sm:py-24'
		>
			<Link
				href='https://github.com/sidali-djeghbal'
				target='_blank'
				rel='noreferrer'
				className='group relative flex items-center gap-3.5 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-zinc-900/60 px-6 py-3.5 text-sm sm:text-base font-medium shadow-xs backdrop-blur-md transition-all duration-300 hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-zinc-800/80 hover:shadow-lg dark:hover:shadow-white/5 active:scale-95'
			>
				<span className='transition-transform duration-200 group-hover:scale-110'>
					<GithubIcon
						size={22}
						className='p-0 pointer-events-none hover:bg-transparent'
					/>
				</span>
				<span className='text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors duration-200'>
					Visit my GitHub for more projects
				</span>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='18'
					height='18'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
					className='text-gray-400 group-hover:text-black dark:group-hover:text-white transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
					aria-hidden='true'
				>
					<title>External link</title>
					<line x1='7' y1='17' x2='17' y2='7' />
					<polyline points='7 7 17 7 17 17' />
				</svg>
			</Link>
		</motion.div>
	);
}
