import { cache } from 'react';
import type { UserStats, WakaTimeAllTimeStats } from './types';

const WAKATIME_ENDPOINT = 'https://wakatime.com/api/v1';

const getWakatimeToken = cache(() => {
	const secret_key = process.env.WAKATIME_SECRET_KEY;

	if (!secret_key) {
		return null;
	}

	return Buffer.from(`${secret_key} :`).toString('base64');
});

const emptyAllTimeStats: WakaTimeAllTimeStats = {
	daily_average: 0,
	decimal: '0',
	digital: '0:00',
	is_up_to_date: false,
	percent_calculated: 0,
	range: {
		end: '',
		end_date: '',
		end_text: '',
		start: '',
		start_date: '',
		start_text: '',
		timezone: '',
	},
	text: '0 hrs',
	timeout: 0,
	total_seconds: 0,
};

const emptyUserStats: UserStats = {
	best_day: {
		date: new Date().toISOString().split('T')[0],
		text: '0 secs',
		total_seconds: 0,
	},
	human_readable_daily_average: '0 hrs',
	human_readable_total: '0 hrs',
	daily_average: 0,
	total_seconds: 0,
	total_seconds_including_other_language: 0,
	projects: [],
};

// https://wakatime.com/developers#all_time_since_today
export const getAllTimeStats = cache(
	async (): Promise<WakaTimeAllTimeStats> => {
		const token = getWakatimeToken();

		if (!token) {
			return emptyAllTimeStats;
		}

		try {
			const response = await fetch(
				`${WAKATIME_ENDPOINT}/users/current/all_time_since_today`,
				{
					headers: {
						Authorization: `Basic ${token}`,
					},
					next: { revalidate: 3600 },
				},
			);

			if (!response.ok) {
				console.error('Error:', response.status, await response.text());
				return emptyAllTimeStats;
			}

			const result = await response.json();
			return result.data ?? emptyAllTimeStats;
		} catch (error) {
			console.error('Failed to fetch WakaTime all-time stats:', error);
			return emptyAllTimeStats;
		}
	},
);

// https://wakatime.com/developers#stats
export const getStatsThisWeek = cache(async (): Promise<UserStats> => {
	const token = getWakatimeToken();

	if (!token) {
		return emptyUserStats;
	}

	try {
		const response = await fetch(
			`${WAKATIME_ENDPOINT}/users/current/stats/last_7_days`,
			{
				headers: {
					Authorization: `Basic ${token}`,
				},
				next: { revalidate: 3600 },
			},
		);

		if (!response.ok) {
			console.error('Error:', response.status, await response.text());
			return emptyUserStats;
		}

		const result = await response.json();
		return result.data ?? emptyUserStats;
	} catch (error) {
		console.error('Failed to fetch WakaTime weekly stats:', error);
		return emptyUserStats;
	}
});
