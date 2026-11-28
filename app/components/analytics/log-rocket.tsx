'use client';

import { useEffect } from 'react';

let initialized = false;

export default function LogRocket() {
	const logrocketId = (process.env.NEXT_PUBLIC_LOGROCKET_ID ?? '').trim();

	useEffect(() => {
		if (!logrocketId || initialized) {
			return;
		}
		initialized = true;

		Promise.all([import('logrocket'), import('logrocket-react')])
			.then(([rocketModule, setupModule]) => {
				const rocket = rocketModule.default ?? rocketModule;
				const setupLogRocketReact = setupModule.default ?? setupModule;
				rocket.init(logrocketId);
				setupLogRocketReact();
			})
			.catch((err) => {
				initialized = false;
				console.error('Failed to load LogRocket:', err);
			});
	}, [logrocketId]);

	return null;
}
