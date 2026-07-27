// GA4 event helpers (Build Spec section 10). No-ops gracefully when GA isn't configured.
// Events: guide_start, guide_step, guide_complete, lead_capture, result_link_click, consult_cta_click.

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? "";

function track(event: string, params: GtagParams = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  } else if (process.env.NODE_ENV !== "production") {
    // Visible in dev so events can be verified without a live GA property.
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, params);
  }
}

export const analytics = {
  guideStart: () => track("guide_start"),
  guideStep: (step: number) => track("guide_step", { step }),
  guideComplete: (style: string) => track("guide_complete", { style }),
  leadCapture: (suburb?: string) => track("lead_capture", { suburb }),
  resultLinkClick: (destination: string, kind: string) =>
    track("result_link_click", { destination, kind }),
  consultCtaClick: (location: string) => track("consult_cta_click", { location }),
};
