import type { ProjectModal } from './types';

interface ProjectProps {
	index: number;
	title: string;
	description: string;
	url?: string;
	githubUrl?: string;
	role: string;
	date?: string;
	tags?: string[];
	setModal: (modal: ProjectModal) => void;
}

export default function ProjectItem({
	index,
	title,
	description,
	url,
	githubUrl,
	role,
	date,
	tags,
	setModal,
}: ProjectProps) {
	const stretchedClass =
		"after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500";

	return (
		<article
			className='group relative isolate flex w-full flex-col justify-between gap-6 border-b border-gray-200 px-4 py-10 sm:flex-row sm:items-center sm:px-10 sm:py-14 dark:border-gray-800'
			onMouseEnter={() => {
				setModal({ active: true, index });
			}}
			onMouseLeave={() => {
				setModal({ active: false, index });
			}}
		>
			<div className='flex min-w-0 flex-col gap-3'>
				<h2 className='text-2xl transition-transform group-hover:-translate-x-2 group-hover:scale-[1.03] sm:text-4xl lg:text-5xl'>
					{title}
				</h2>
				<p className='max-w-2xl text-xs font-light leading-5 text-primary-500/80 transition-transform group-hover:translate-x-2 sm:text-sm sm:leading-6'>
					{description}
				</p>

				{tags && tags.length > 0 && (
					<div className='flex flex-wrap gap-1.5 pt-1'>
						{tags.map((tag) => (
							<span
								key={tag}
								className='rounded-full border border-gray-200 px-2.5 py-0.5 text-[11px] text-gray-600 dark:border-gray-800 dark:text-gray-400'
							>
								{tag}
							</span>
						))}
					</div>
				)}

				{(url || githubUrl) && (
					<div className='flex flex-wrap items-center gap-4 pt-1 text-xs font-medium'>
						{url && (
							<a
								href={url}
								target='_blank'
								rel='noreferrer'
								aria-label={`${title} live demo`}
								className={`inline-flex items-center gap-1 underline-offset-4 hover:underline ${stretchedClass}`}
							>
								<span>Live Demo</span>
								<span aria-hidden='true'>↗</span>
							</a>
						)}
						{githubUrl && (
							<a
								href={githubUrl}
								target='_blank'
								rel='noreferrer'
								aria-label={`${title} GitHub repository`}
								className={
									url
										? 'relative z-10 inline-flex items-center gap-1 text-gray-600 underline-offset-4 hover:text-black hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500 dark:text-gray-400 dark:hover:text-white'
										: `inline-flex items-center gap-1 underline-offset-4 hover:underline ${stretchedClass}`
								}
							>
								<span>GitHub</span>
								<span aria-hidden='true'>↗</span>
							</a>
						)}
					</div>
				)}
			</div>

			<div className='shrink-0 transition-transform group-hover:translate-x-2 sm:text-right'>
				<p className='text-sm font-light sm:text-lg'>{role}</p>
				{date && (
					<p className='mt-0.5 font-mono text-xs text-gray-600 dark:text-gray-400'>
						{date}
					</p>
				)}
			</div>
		</article>
	);
}
