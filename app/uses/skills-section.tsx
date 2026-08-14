import classNames from 'classnames';
import { merryWeather } from '../fonts';

const techStackGroups = [
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
		],
	},
];

const softSkills = [
	'Problem Solving',
	'Analytical Thinking',
	'Attention to Detail',
	'Clear Communication',
	'Structured Thinking',
	'Time Management',
	'Adaptability',
	'Continuous Learning',
];

const pillClassName =
	'border border-gray-300 px-3 py-1 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300';

export default function SkillsSection() {
	return (
		<section className='mt-12 space-y-14'>
			<div>
				<h2
					className={classNames(
						'text-2xl font-bold tracking-tight md:text-3xl',
						merryWeather.className,
					)}
				>
					Tech Stack
				</h2>
				<div className='mt-6 flex flex-col gap-8'>
					{techStackGroups.map((group) => (
						<div key={group.title}>
							<h3 className='mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400'>
								{group.title}
							</h3>
							<div className='flex flex-wrap gap-2'>
								{group.skills.map((skill) => (
									<span key={skill} className={pillClassName}>
										{skill}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
			<div>
				<h2
					className={classNames(
						'text-2xl font-bold tracking-tight md:text-3xl',
						merryWeather.className,
					)}
				>
					Soft Skills
				</h2>
				<div className='mt-6 flex flex-wrap gap-2'>
					{softSkills.map((skill) => (
						<span key={skill} className={pillClassName}>
							{skill}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
