'use client';

import { useEffect } from 'react';

export default function LogRocket() {
	const logrocketId = process.env.NEXT_PUBLIC_LOGROCKET_ID || '';

	useEffect(() => {
		if (!logrocketId) {
			return;
		}

		Promise.all([import('logrocket'), import('logrocket-react')])
			.then(([rocketModule, setupModule]) => {
				const rocket = rocketModule.default;
				const setupLogRocketReact = setupModule.default;
				rocket.init(logrocketId);
				setupLogRocketReact();
			})
			.catch((err) => {
				console.error('Failed to load LogRocket:', err);
			});
	}, [logrocketId]);

	return null;
}
