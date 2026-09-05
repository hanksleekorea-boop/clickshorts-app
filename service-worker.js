/* ClickShorts owned cache only · v4.0-72324fd6816c */
const APP_PREFIX = 'clickshorts-app-';
const CACHE_NAME = APP_PREFIX + "v4.0-72324fd6816c";
const APP_SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon192.png", "./icon512.png", "./clickshorts-current-qr.png", "./privacy.html", "./advertising.html", "./help.html", "./adsense-readiness.json", "./robots.txt", "./sitemap.xml", "./guides.html", "./terms.html", "./stage12-content.json"];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(APP_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('message', event => { if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || /\/(api|auth|oauth)\//i.test(url.pathname) || request.headers.has('authorization')) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => response && response.ok ? response : Promise.reject(new Error('network'))).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (!response || !response.ok || response.type !== 'basic') return response;
    const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(request, copy)); return response;
  })));
});
