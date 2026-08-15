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
	user: {
		contributionsCollection: {
			contributionCalendar: ContributionCalendar;
		};
	};
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
		return NextResponse.json({ error: 'Invalid year' }, { status: 400 });
	}

	const token = process.env.GITHUB_TOKEN;

	if (!token) {
		return NextResponse.json(
			{ error: 'GITHUB_TOKEN is not configured' },
			{ status: 500 },
		);
	}

	const { from, to } = getDateRange(year);

	try {
		const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
			method: 'POST',
			headers: {
				authorization: `bearer ${token}`,
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				query,
				variables: { username: GITHUB_USERNAME, from, to },
			}),
		});

		const payload = (await response.json()) as GithubResponse & {
			errors?: { message: string }[];
		};

		if (!response.ok || payload.errors) {
			return NextResponse.json(
				{
					error:
						payload.errors?.[0]?.message ??
						`GitHub API responded with ${response.status}`,
				},
				{ status: response.status >= 500 ? response.status : 502 },
			);
		}

		return NextResponse.json(
			payload.user.contributionsCollection.contributionCalendar,
			{
				headers: {
					'Cache-Control':
						'public, s-maxage=3600, stale-while-revalidate=86400',
				},
			},
		);
	} catch {
		return NextResponse.json(
			{ error: 'Failed to fetch contributions' },
			{ status: 502 },
		);
	}
}
