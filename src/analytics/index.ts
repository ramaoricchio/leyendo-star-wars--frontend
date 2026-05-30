const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export function init(): void {
  if (!GA_ID) return

  window.dataLayer = window.dataLayer || []
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)

  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  script.async = true
  document.head.appendChild(script)
}

export function trackPageView(path: string): void {
  if (!GA_ID || typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', { page_path: path })
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (!GA_ID || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
