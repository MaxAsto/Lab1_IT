export default async function middleware(request) {
  // Використовуємо глобальний Web API URL (без імпорту)
  const url = new URL(request.url)

  // Якщо шлях не починається з /ingest → нічого не робимо
  if (!url.pathname.startsWith('/ingest')) {
    return
  }

  // Формуємо шлях для PostHog
  const posthogPath = url.pathname.replace('/ingest', '')

  // Цільовий домен PostHog
  const targetUrl = new URL(posthogPath, 'https://eu.posthog.com')

  // Пересилаємо запит далі
  return fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  })
}
