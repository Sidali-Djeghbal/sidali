'use client';

import LogRocket from 'app/components/analytics/log-rocket';
import Script from 'next/script';
import { Fragment } from 'react';

const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? '';

export default function Analytics() {
	return (
		<Fragment>
			{umamiWebsiteId && (
				<Script
					strategy='lazyOnload'
					src='/umami.js'
					data-website-id={umamiWebsiteId}
				/>
			)}
			<LogRocket />
		</Fragment>
	);
}
