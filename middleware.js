export default async function middleware(request) {
  const url = new URL(request.url)

  
  if (!url.pathname.startsWith('/ingest')) {
    return
  }

  // Формуємо шлях для PostHog
  const posthogPath = url.pathname.replace('/ingest', '')

  // Цільовий домен PostHog
  const targetUrl = new URL(posthogPath, 'https://eu.posthog.com')

  // Пересилаємо запит
  return fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  })
}
