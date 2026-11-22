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
		title: 'Frontend & UI',
		description:
			'Building high-interactivity, accessible, and multilingual web interfaces.',
		skills: [
			'TypeScript',
			'JavaScript (ES6+)',
			'React 19',
			'Next.js (App Router / RSC)',
			'HTML5',
			'CSS3',
			'Tailwind CSS',
			'Responsive & RTL/LTR Layout',
			'WCAG Accessibility',
			'TanStack Query',
			'Zod',
			'TipTap',
			'Turf.js',
			'MapLibre GL',
			'React-Admin',
			'Blockly',
			'Framer Motion',
			'Three.js',
			'GSAP',
			'Radix UI',
			'REST API Integration',
		],
	},
	{
		number: '02',
		title: 'Testing & Tooling',
		description:
			'Keeping UI logic and end-to-end user flows verified and reliable.',
		skills: [
			'Vitest',
			'Playwright',
			'Git',
			'Linux',
			'Postman',
			'Vite',
			'OpenAI API',
		],
	},
	{
		number: '03',
		title: 'Backend & Data',
		description:
			'Designing APIs, schemas, and data layers that stay simple and scalable.',
		skills: [
			'Python',
			'FastAPI',
			'Node.js',
			'PostgreSQL',
			'SQL',
			'Supabase',
			'Firebase',
			'Prisma',
			'SQLAlchemy',
			'GraphQL',
		],
	},
	{
		number: '04',
		title: 'Cross-Platform',
		description: 'Shipping mobile and desktop experiences beyond the browser.',
		skills: ['React Native', 'Expo', 'Electron', 'Tauri', 'Capacitor'],
	},
	{
		number: '05',
		title: 'Cloud & Edge',
		description:
			'Deploying products with edge runtimes, containers, and automated CI/CD.',
		skills: [
			'Cloudflare Workers',
			'Cloudflare Pages',
			'Docker',
			'GitHub Actions',
			'Vercel',
			'Netlify',
			'CI/CD',
		],
	},
	{
		number: '06',
		title: 'Web Craft',
		description:
			'Focusing on discoverability, performance, and maintainable UI systems.',
		skills: [
			'SEO / JSON-LD',
			'PWA',
			'Web Performance',
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
						<p className='mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-gray-600 dark:text-gray-400'>
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

						<p className='mt-4 max-w-xs text-sm leading-6 text-gray-600 dark:text-gray-400'>
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

										<p className='mt-1.5 max-w-48 text-xs leading-5 text-gray-600 dark:text-gray-400'>
											{group.description}
										</p>
									</div>

									<div className='flex flex-wrap content-start gap-x-2 gap-y-2 pt-0.5'>
										{group.skills.map((skill) => (
											<span
												key={skill}
												className='group/skill relative inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition-colors duration-200 hover:border-gray-300 hover:text-gray-950 dark:border-gray-800 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:text-white'
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
						<p className='mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-gray-600 dark:text-gray-400'>
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

						<p className='mt-4 max-w-xs text-sm leading-6 text-gray-600 dark:text-gray-400'>
							The principles I bring into collaboration, problem solving, and
							day-to-day work.
						</p>
					</div>

					<div className='grid gap-3 sm:grid-cols-2'>
						{softSkills.map((skill) => (
							<div
								key={skill.name}
								className='group relative flex gap-4 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 transition-colors duration-200 hover:border-gray-300 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-gray-700 dark:hover:bg-gray-900'
							>
								<span className='mt-0.5 shrink-0 font-mono text-xs font-medium text-gray-600 dark:text-gray-400'>
									{skill.number}
								</span>

								<div>
									<h3 className='text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-100'>
										{skill.name}
									</h3>
									<p className='mt-1 text-xs leading-5 text-gray-600 dark:text-gray-400'>
										{skill.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className='mt-16 flex items-center gap-4 border-t border-gray-200 pt-6 dark:border-gray-800'>
				<span className='size-1.5 rounded-full bg-gray-400 dark:bg-gray-600' />

				<p className='text-xs text-gray-600 dark:text-gray-400'>
					Tools change. The goal stays the same: build useful things, well.
				</p>
			</div>
		</section>
	);
}
