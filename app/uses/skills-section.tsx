import classNames from 'classnames';
import { merryWeather } from '../fonts';

type TechStackGroup = {
	number: string;
	title: string;
	description: string;
	skills: string[];
};

type SoftSkill = {
	number: string;
	name: string;
	description: string;
};

const techStackGroups: TechStackGroup[] = [
	{
		number: '01',
		title: 'Frontend',
		description: 'Building polished interfaces with modern web technologies.',
		skills: [
			'React',
			'Next.js',
			'TypeScript',
			'JavaScript',
			'Tailwind CSS',
			'HTML / CSS',
			'Sass / SCSS',
			'Framer Motion',
			'Three.js',
			'GSAP',
			'Vite',
			'Webpack',
			'Material UI',
			'Headless UI',
			'Radix UI',
		],
	},
	{
		number: '02',
		title: 'Backend',
		description:
			'Designing APIs and application logic that stay simple and scalable.',
		skills: [
			'Python',
			'FastAPI',
			'Node.js',
			'REST APIs',
			'GraphQL',
			'Express.js',
			'Flask',
			'Django',
			'NestJS',
		],
	},
	{
		number: '03',
		title: 'Databases',
		description: 'Working with structured data, storage, and backend services.',
		skills: [
			'PostgreSQL',
			'Supabase',
			'Firebase',
			'MySQL',
			'MongoDB',
			'Redis',
			'SQLite',
			'Prisma',
			'SQLAlchemy',
		],
	},
	{
		number: '04',
		title: 'Applications',
		description:
			'Creating experiences that move beyond the traditional browser.',
		skills: [
			'React Native',
			'Expo',
			'Capacitor',
			'Android',
			'Electron',
			'Tauri',
		],
	},
	{
		number: '05',
		title: 'Cloud & DevOps',
		description:
			'Shipping products with reliable deployment and automation workflows.',
		skills: [
			'Docker',
			'GitHub Actions',
			'Cloudflare Pages',
			'Netlify',
			'Vercel',
			'Render',
			'AWS',
			'GCP',
			'Heroku',
			'CI/CD',
		],
	},
	{
		number: '06',
		title: 'Web Craft',
		description:
			'Improving discoverability, accessibility, performance, and reach.',
		skills: [
			'PWA',
			'Blockly',
			'SEO / GEO',
			'RTL / Arabic Web',
			'Web Scraping',
			'Web Accessibility',
			'Web Performance',
		],
	},
	{
		number: '07',
		title: 'Delivery',
		description:
			'Turning designs and ideas into maintainable production interfaces.',
		skills: [
			'UI Implementation',
			'Responsive Design',
			'Cross-Browser Testing',
			'Component Architecture',
			'Design Systems',
		],
	},
];

const softSkills: SoftSkill[] = [
	{
		number: '01',
		name: 'Problem Solving',
		description: 'Finding clear solutions to complex problems.',
	},
	{
		number: '02',
		name: 'Analytical Thinking',
		description: 'Understanding the system before changing it.',
	},
	{
		number: '03',
		name: 'Attention to Detail',
		description: 'Caring about the details that shape the final experience.',
	},
	{
		number: '04',
		name: 'Clear Communication',
		description: 'Keeping technical ideas simple and understandable.',
	},
	{
		number: '05',
		name: 'Structured Thinking',
		description: 'Breaking large ideas into useful, manageable steps.',
	},
	{
		number: '06',
		name: 'Time Management',
		description: 'Prioritizing what matters and maintaining momentum.',
	},
	{
		number: '07',
		name: 'Adaptability',
		description: 'Comfortably adjusting to new requirements and tools.',
	},
	{
		number: '08',
		name: 'Continuous Learning',
		description: 'Always looking for better ways to build and improve.',
	},
];

export default function SkillsSection() {
	return (
		<section className='mt-24 sm:mt-32'>
			<div>
				<div className='grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16'>
					<div className='max-w-sm'>
						<p className='mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-gray-400 dark:text-gray-600'>
							Expertise
						</p>

						<h2
							className={classNames(
								'text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl dark:text-white',
								merryWeather.className,
							)}
						>
							Tech Stack
						</h2>

						<p className='mt-4 max-w-xs text-sm leading-6 text-gray-500 dark:text-gray-500'>
							The tools and technologies I use to turn ideas into working
							products.
						</p>
					</div>

					<div className='divide-y divide-gray-200 border-t border-gray-200 dark:divide-gray-800 dark:border-gray-800'>
						{techStackGroups.map((group) => (
							<div
								key={group.number}
								className={classNames('group py-6 sm:py-7')}
							>
								<div className='grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-10'>
									<div className='max-w-sm'>
										<h3 className='text-base font-semibold tracking-tight text-gray-950 dark:text-white'>
											{group.title}
										</h3>

										<p className='mt-1.5 max-w-48 text-xs leading-5 text-gray-400 dark:text-gray-600'>
											{group.description}
										</p>
									</div>

									<div className='flex flex-nowrap content-start gap-x-3 gap-y-2 overflow-x-auto pb-1 sm:pt-0.5 lg:flex-wrap lg:overflow-visible lg:pb-0 lg:justify-start'>
										{group.skills.map((skill) => (
											<span
												key={skill}
												className='group/skill relative inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition-colors duration-200 hover:border-gray-300 hover:text-gray-950 dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-white'
											>
												{skill}
											</span>
										))}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className='mt-28 sm:mt-36'>
				<div className='grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16'>
					<div className='max-w-sm'>
						<p className='mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-gray-400 dark:text-gray-600'>
							Approach
						</p>

						<h2
							className={classNames(
								'text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl dark:text-white',
								merryWeather.className,
							)}
						>
							Soft Skills
						</h2>

						<p className='mt-4 max-w-xs text-sm leading-6 text-gray-500 dark:text-gray-500'>
							The principles I bring into collaboration, problem solving, and
							day-to-day work.
						</p>
					</div>

					<div className='divide-y divide-gray-200 border-t border-gray-200 dark:divide-gray-800 dark:border-gray-800'>
						{softSkills.map((skill) => (
							<div
								key={skill.name}
								className={classNames(
									'grid gap-2 py-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start sm:gap-8',
								)}
							>
								<h3 className='text-sm font-semibold tracking-tight text-gray-900 whitespace-nowrap dark:text-gray-200'>
									{skill.name}
								</h3>

								<p className='min-w-0 text-sm leading-6 text-gray-500 dark:text-gray-600'>
									{skill.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className='mt-16 flex items-center gap-4 border-t border-gray-200 pt-6 dark:border-gray-800'>
				<span className='size-1.5 rounded-full bg-gray-400 dark:bg-gray-600' />

				<p className='text-xs text-gray-500 dark:text-gray-600'>
					Tools change. The goal stays the same: build useful things, well.
				</p>
			</div>
		</section>
	);
}
