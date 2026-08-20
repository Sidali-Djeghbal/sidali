import { NextResponse } from 'next/server';
import {
	type ContributionCalendar,
	GITHUB_USERNAME,
} from '../../components/github-contributions/github';

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

const query = `
  query ($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          colors
          totalContributions
          weeks {
            contributionDays {
              color
              date
              contributionCount
            }
            firstDay
          }
          months {
            firstDay
            name
            totalWeeks
          }
        }
      }
    }
  }
`;

type GithubResponse = {
	data: {
		user: {
			contributionsCollection: {
				contributionCalendar: ContributionCalendar;
			};
		};
	};
	errors?: { message: string }[];
};

function getDateRange(year: number) {
	const today = new Date();
	const currentYear = today.getFullYear();

	if (year === currentYear) {
		const pastYear = new Date();
		pastYear.setFullYear(today.getFullYear() - 1);
		return { from: pastYear.toISOString(), to: today.toISOString() };
	}

	return {
		from: new Date(year, 0, 1).toISOString(),
		to: new Date(year, 11, 31, 23, 59, 59).toISOString(),
	};
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const year = Number(searchParams.get('year'));

	if (!Number.isInteger(year) || year < 2000 || year > 2100) {
		return NextResponse.json(
			{ error: 'Invalid year' },
			{ status: 400, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
		);
	}

	const token = process.env.GITHUB_TOKEN;

	if (!token) {
		return NextResponse.json(
			{ error: 'GITHUB_TOKEN is not configured' },
			{ status: 500, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
		);
	}

	const { from, to } = getDateRange(year);

	try {
		const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
			method: 'POST',
			headers: {
				authorization: `bearer ${token}`,
				'content-type': 'application/json',
				'user-agent': 'sidali-portfolio',
			},
			body: JSON.stringify({
				query,
				variables: { username: GITHUB_USERNAME, from, to },
			}),
		});

		const text = await response.text();

		if (!response.ok) {
			return NextResponse.json(
				{ error: `GitHub API responded with ${response.status}` },
				{ status: 502, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
			);
		}

		const payload = JSON.parse(text) as GithubResponse;

		if (payload.errors) {
			return NextResponse.json(
				{
					error: payload.errors?.[0]?.message ?? 'GraphQL error',
				},
				{ status: 502, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
			);
		}

		if (!payload.data?.user) {
			return NextResponse.json(
				{ error: 'No user in response' },
				{ status: 502, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
			);
		}

		return NextResponse.json(
			payload.data.user.contributionsCollection.contributionCalendar,
			{
				headers: {
					'Cache-Control':
						'public, s-maxage=3600, stale-while-revalidate=86400',
					'X-Robots-Tag': 'noindex, nofollow',
				},
			},
		);
	} catch (e: unknown) {
		const detail = e instanceof Error ? e.message : String(e);
		return NextResponse.json(
			{ error: 'Failed to fetch contributions', detail },
			{ status: 502, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
		);
	}
}
