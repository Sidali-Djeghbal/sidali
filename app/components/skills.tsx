import classNames from 'classnames';
import { merryWeather } from '../fonts';

const skillGroups = [
	{
		title: 'Frontend',
		skills: [
			'React',
			'Next.js',
			'TypeScript',
			'JavaScript',
			'Tailwind CSS',
			'HTML/CSS',
		],
	},
	{
		title: 'Backend',
		skills: ['Python', 'FastAPI', 'Node.js', 'REST APIs'],
	},
	{
		title: 'Databases & BaaS',
		skills: ['PostgreSQL', 'Supabase', 'Firebase', 'Firestore', 'MySQL'],
	},
	{
		title: 'Mobile & Desktop',
		skills: ['React Native', 'Expo', 'Capacitor', 'Android', 'Electron'],
	},
	{
		title: 'DevOps & Cloud',
		skills: ['Docker', 'GitHub Actions', 'Cloudflare Pages', 'Netlify'],
	},
	{
		title: 'Other',
		skills: ['PWA', 'Blockly', 'SEO/GEO', 'RTL/Arabic Web', 'Web Scraping'],
	},
	{
		title: 'Additional',
		skills: [
			'UI implementation',
			'Responsive design',
			'Component-based architecture',
			'Problem Solving',
			'Analytical Thinking',
			'Attention to Detail',
			'Clear Communication',
			'Structured Thinking',
			'Time Management',
			'Adaptability',
			'Continuous Learning',
		],
	},
];

export default function Skills() {
	return (
		<section className='relative z-10 bg-white text-black dark:bg-black dark:text-white'>
			<div className='mx-auto flex max-w-5xl flex-col gap-12 px-8 py-24 md:px-24 md:py-32'>
				<div>
					<h2
						className={classNames(
							'text-3xl font-bold tracking-tight md:text-5xl',
							merryWeather.className,
						)}
					>
						Skills
					</h2>
					<p className='mt-4 text-gray-500 dark:text-gray-400'>
						The things I do well.
					</p>
				</div>
				<div className='flex flex-col gap-10'>
					{skillGroups.map((group) => (
						<div key={group.title}>
							<h3 className='mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400'>
								{group.title}
							</h3>
							<div className='flex flex-wrap gap-2'>
								{group.skills.map((skill) => (
									<span
										key={skill}
										className='border border-gray-300 px-3 py-1 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300'
									>
										{skill}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
