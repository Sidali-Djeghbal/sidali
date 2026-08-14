'use client';

import rocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { useEffect } from 'react';

export default function LogRocket() {
	const logrocketId = process.env.NEXT_PUBLIC_LOGROCKET_ID || '';

	useEffect(() => {
		if (!logrocketId) {
			return;
		}

		rocket.init(logrocketId);
		setupLogRocketReact();
	}, [logrocketId]);

	return null;
}
