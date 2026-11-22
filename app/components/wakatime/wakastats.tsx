import { format, secondsToMinutes } from 'date-fns';
import AnimatedNumber from '../animated-number';
import StatItem from '../stat-item';
import { extractHoursAndMinutes, secondsToHours } from './utils';
import { getAllTimeStats, getStatsThisWeek } from './wakatime';

export default async function WakaStats() {
	const [allTimeStats, thisWeekStats] = await Promise.all([
		getAllTimeStats(),
		getStatsThisWeek(),
	]);

	const hasStats = Boolean(allTimeStats || thisWeekStats);
	const { hours, minutes } = extractHoursAndMinutes(allTimeStats?.text);
	const bestDayDate = thisWeekStats?.best_day?.date;
	const formattedBestDay =
		bestDayDate && !Number.isNaN(Date.parse(bestDayDate))
			? format(new Date(bestDayDate), 'PP')
			: '—';
	const allTimeDailyAvg = allTimeStats?.daily_average ?? 0;
	const weeklyDailyAvg = thisWeekStats?.daily_average ?? 0;

	return (
		<section className='space-y-4 mt-7'>
			<div>
				<h2 className='text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100'>
					Wakatime
				</h2>
				<p className='text-gray-500 dark:text-gray-400 leading-4'>
					Coding Stats
				</p>
			</div>
			{!hasStats ? (
				<div className='rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-4 text-sm text-neutral-600 dark:text-neutral-400'>
					Unable to load WakaTime coding stats at this time.
				</div>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
					<StatItem title='All time'>
						<AnimatedNumber number={hours} /> <span>hours </span>
						<AnimatedNumber number={minutes} /> <span>minutes</span>
					</StatItem>
					<StatItem title='Best Day Coding'>
						<span>{formattedBestDay} — </span>
						<AnimatedNumber
							number={secondsToHours(
								thisWeekStats?.best_day?.total_seconds ?? 0,
							)}
						/>{' '}
						<span>hours</span>
					</StatItem>
					<StatItem title='Daily Average'>
						<AnimatedNumber number={secondsToHours(allTimeDailyAvg)} />{' '}
						<span>hours / </span>
						<AnimatedNumber number={secondsToMinutes(allTimeDailyAvg)} />{' '}
						<span>minutes</span>
					</StatItem>
					<StatItem title='Weekly Average'>
						<AnimatedNumber number={secondsToHours(weeklyDailyAvg)} />{' '}
						<span>hours / </span>
						<AnimatedNumber number={secondsToMinutes(weeklyDailyAvg)} />{' '}
						<span>minutes</span>
					</StatItem>
				</div>
			)}
		</section>
	);
}
