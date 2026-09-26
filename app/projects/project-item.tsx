import type { ProjectModal } from './types';

interface ProjectProps {
	index: number;
	title: string;
	description: string;
	url?: string;
	role: string;
	setModal: (modal: ProjectModal) => void;
}

export default function ProjectItem({
	index,
	title,
	description,
	url,
	role,
	setModal,
}: ProjectProps) {
	const className =
		'group flex w-full items-center justify-between border-b px-4 py-10 sm:px-10 sm:py-16';
	const content = (
		<>
			<div className='flex flex-col gap-2'>
				<h2 className='text-2xl transition-transform group-hover:-translate-x-3 group-hover:scale-110 sm:text-6xl'>
					{title}
				</h2>
				<p className='max-w-xl text-xs font-light text-primary-500/80 transition-transform group-hover:translate-x-3 group-hover:scale-105 sm:text-sm'>
					{description}
				</p>
			</div>
			<p className='text-sm font-light transition-transform group-hover:translate-x-3 group-hover:scale-110 sm:text-lg'>
				{role}
			</p>
		</>
	);

	if (!url) {
		return (
			<div
				className={className}
				onMouseEnter={() => {
					setModal({ active: true, index });
				}}
				onMouseLeave={() => {
					setModal({ active: false, index });
				}}
			>
				{content}
			</div>
		);
	}

	return (
		<a
			href={url}
			target='_blank'
			onMouseEnter={() => {
				setModal({ active: true, index });
			}}
			onMouseLeave={() => {
				setModal({ active: false, index });
			}}
			className={className}
			rel='noreferrer'
		>
			{content}
		</a>
	);
}
