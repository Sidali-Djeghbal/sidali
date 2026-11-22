import { cache } from 'react';
import type { UserStats, WakaTimeAllTimeStats } from './types';

const WAKATIME_ENDPOINT = 'https://api.wakatime.com/api/v1';

const getWakatimeToken = cache(() => {
	const secretKey = process.env.WAKATIME_SECRET_KEY?.trim();

	if (!secretKey) {
		return null;
	}

	return Buffer.from(secretKey).toString('base64');
});

// https://wakatime.com/developers#all_time_since_today
export const getAllTimeStats = cache(
	async (): Promise<WakaTimeAllTimeStats | null> => {
		const token = getWakatimeToken();

		if (!token) {
			return null;
		}

		try {
			const response = await fetch(
				`${WAKATIME_ENDPOINT}/users/current/all_time_since_today`,
				{
					headers: {
						Authorization: `Basic ${token}`,
					},
					next: { revalidate: 3600 },
					signal: AbortSignal.timeout(5000),
				},
			);

			if (!response.ok) {
				console.error(
					'WakaTime error:',
					response.status,
					await response.text(),
				);
				return null;
			}

			const result = await response.json();
			return result.data ?? null;
		} catch (error) {
			console.error('Failed to fetch WakaTime all-time stats:', error);
			return null;
		}
	},
);

// https://wakatime.com/developers#stats
export const getStatsThisWeek = cache(async (): Promise<UserStats | null> => {
	const token = getWakatimeToken();

	if (!token) {
		return null;
	}

	try {
		const response = await fetch(
			`${WAKATIME_ENDPOINT}/users/current/stats/last_7_days`,
			{
				headers: {
					Authorization: `Basic ${token}`,
				},
				next: { revalidate: 3600 },
				signal: AbortSignal.timeout(5000),
			},
		);

		if (!response.ok) {
			console.error('WakaTime error:', response.status, await response.text());
			return null;
		}

		const result = await response.json();
		return result.data ?? null;
	} catch (error) {
		console.error('Failed to fetch WakaTime weekly stats:', error);
		return null;
	}
});
