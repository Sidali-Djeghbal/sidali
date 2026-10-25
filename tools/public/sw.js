/* Service Worker for Command Center PWA */

const CACHE_NAME = 'command-center-v1';
const STATIC_ASSETS = [
	'/',
	'/index.html',
	'/styles.css',
	'/app.js',
	'/logo.svg',
	'/manifest.webmanifest',
	'/icons/icon-192.png',
	'/icons/icon-512.png',
	'/icons/icon-maskable-192.png',
	'/icons/icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
	);
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) =>
			Promise.all(
				keys.map((key) => {
					if (key !== CACHE_NAME) {
						return caches.delete(key);
					}
				}),
			),
		),
	);
	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);

	// Never cache OAuth auth endpoints or API mutations
	if (
		url.pathname.startsWith('/api/auth') ||
		url.pathname === '/api/logout' ||
		(url.pathname.startsWith('/api/') && event.request.method !== 'GET')
	) {
		return;
	}

	// Network-first for GET /api/ requests so data is always fresh
	if (url.pathname.startsWith('/api/')) {
		event.respondWith(
			fetch(event.request).catch(() => caches.match(event.request)),
		);
		return;
	}

	// Stale-while-revalidate for static assets
	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			const fetchPromise = fetch(event.request)
				.then((networkResponse) => {
					if (
						networkResponse &&
						networkResponse.status === 200 &&
						networkResponse.type === 'basic'
					) {
						const responseToCache = networkResponse.clone();
						caches.open(CACHE_NAME).then((cache) => {
							cache.put(event.request, responseToCache);
						});
					}
					return networkResponse;
				})
				.catch(() => cachedResponse);

			return cachedResponse || fetchPromise;
		}),
	);
});
