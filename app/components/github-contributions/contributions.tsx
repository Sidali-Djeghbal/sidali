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

	const { data: contributions, isLoading } = useSWR(
		['contributions', GITHUB_USERNAME, year], // Cache key
		() => fetcher(year),
	);

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
