// Privacy-conscious analytics integration
// Safe: Never logs or passes personally identifiable information (PII) such as phone, email, or client messages

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export type AnalyticsEventType =
  | 'page_view'
  | 'project_view'
  | 'service_view'
  | 'consultation_form_started'
  | 'consultation_step_completed'
  | 'consultation_form_completed'
  | 'consultation_form_failed'
  | 'whatsapp_clicked'
  | 'phone_clicked'
  | 'email_clicked'
  | 'project_filter_used'
  | 'project_gallery_opened';

let isInitialized = false;

export function initAnalytics() {
  if (typeof window === 'undefined' || isInitialized) return;

  const gaId =
    (import.meta as any).env?.VITE_GA_MEASUREMENT_ID ||
    (import.meta as any).env?.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (gaId && gaId.trim() !== '') {
    try {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer?.push(args);
      }
      window.gtag = gtag;

      gtag('js', new Date());
      gtag('config', gaId, {
        anonymize_ip: true,
        send_page_view: false
      });
      isInitialized = true;
    } catch (err) {
      console.warn('[Analytics] Initialization error skipped:', err);
    }
  }
}

/**
 * Dispatches an event without sensitive PII
 */
export function trackEvent(
  eventName: AnalyticsEventType,
  params: Record<string, string | number | boolean | undefined> = {}
) {
  if (typeof window === 'undefined') return;

  // Sanitize: strictly strip any accidental PII
  const sanitizedParams: Record<string, any> = {};
  for (const [key, val] of Object.entries(params)) {
    if (
      key.toLowerCase().includes('email') ||
      key.toLowerCase().includes('phone') ||
      key.toLowerCase().includes('message') ||
      key.toLowerCase().includes('name') ||
      key.toLowerCase().includes('password')
    ) {
      continue; // Exclude PII
    }
    if (val !== undefined) {
      sanitizedParams[key] = val;
    }
  }

  // Push to dataLayer if available
  if (window.gtag) {
    try {
      window.gtag('event', eventName, sanitizedParams);
    } catch (e) {}
  } else if (window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...sanitizedParams });
  }

  // Log in development if needed
  if ((import.meta as any).env?.DEV) {
    // console.debug(`[Analytics] ${eventName}:`, sanitizedParams);
  }
}
