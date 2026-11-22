import { cache } from 'react';
import type { UserStats, WakaTimeAllTimeStats } from './types';

const WAKATIME_ENDPOINT = 'https://api.wakatime.com/api/v1';

const getWakatimeToken = cache(
	() => process.env.WAKATIME_SECRET_KEY?.trim() || null,
);

async function fetchWakaTime<T>(path: string): Promise<T | null> {
	const token = getWakatimeToken();

	if (!token) {
		return null;
	}

	try {
		const response = await fetch(`${WAKATIME_ENDPOINT}${path}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			next: { revalidate: 3600 },
			signal: AbortSignal.timeout(5000),
		});

		if (!response.ok) {
			console.error('WakaTime error:', response.status, await response.text());
			return null;
		}

		const result = await response.json();
		return (result.data as T) ?? null;
	} catch (error) {
		console.error(`Failed to fetch WakaTime ${path}:`, error);
		return null;
	}
}

// https://wakatime.com/developers#all_time_since_today
export const getAllTimeStats = cache(() =>
	fetchWakaTime<WakaTimeAllTimeStats>('/users/current/all_time_since_today'),
);

// https://wakatime.com/developers#stats
export const getStatsThisWeek = cache(() =>
	fetchWakaTime<UserStats>('/users/current/stats/last_7_days'),
);
