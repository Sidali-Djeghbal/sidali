'use client';

import { Fragment, useState } from 'react';
import useSWR from 'swr';
import Calendar from './calendar';
import Days from './days';
import { type ContributionCalendar, GITHUB_USERNAME } from './github';
import GithubCalendarSkeleton from './github-calendar-skeleton';
import GithubStats from './github-stats';
import GithubStatsSkeleton from './github-stats-skeleton';
import YearSelect from './year-select';

const fetcher = async (year: number): Promise<ContributionCalendar> => {
	const response = await fetch(`/api/github-contributions?year=${year}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch contributions: ${response.status}`);
	}

	return response.json();
};

export default function Contributions() {
	const [year, setYear] = useState(new Date().getFullYear());

	const {
		data: contributions,
		isLoading,
		error,
		mutate,
	} = useSWR(['contributions', GITHUB_USERNAME, year], () => fetcher(year));

	if (error) {
		return (
			<div className='flex flex-col space-y-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-4 text-sm text-neutral-600 dark:text-neutral-400'>
				<p>Unable to load GitHub contribution history at this time.</p>
				<button
					type='button'
					onClick={() => mutate()}
					className='self-start text-xs font-medium underline text-black dark:text-white'
				>
					Try again
				</button>
			</div>
		);
	}

	if (!contributions || isLoading) {
		return (
			<div className='flex flex-col space-y-4'>
				<div className='flex space-x-2'>
					<Days />
					<GithubCalendarSkeleton />
					<YearSelect selectedYear={year} onYearChange={setYear} />
				</div>
				<GithubStatsSkeleton />
			</div>
		);
	}

	return (
		<Fragment>
			<div className='flex space-x-2'>
				<Days />
				<Calendar contributions={contributions} />
				<YearSelect selectedYear={year} onYearChange={setYear} />
			</div>
			<GithubStats contributions={contributions} />
		</Fragment>
	);
}
