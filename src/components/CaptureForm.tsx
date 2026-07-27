"use client";

import { useState } from "react";
import type { Answers, GuideResult } from "@/lib/types";
import { analytics } from "@/lib/analytics";
import { site, budgetOptions } from "@/data/config";

// Lead capture (Build Spec section 9). On submit: POST /api/submit, which re-runs the
// engine server-side, emails the PDF, stores the lead, and returns the full result.

export function CaptureForm({
  answers,
  utm,
  onSuccess,
}: {
  answers: Answers;
  utm?: Record<string, string>;
  onSuccess: (result: GuideResult) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [suburb, setSuburb] = useState("");
  const [budget, setBudget] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!consent) {
      setError("Please tick the box to receive your guide.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, suburb, budget, consent, company, answers, utm }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      analytics.leadCapture(suburb || undefined);
      onSuccess(data.result as GuideResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-panel border border-hairline p-6 sm:p-8">
      <p className="label-eyebrow">Almost there</p>
      <h2 className="font-display text-3xl mt-2 text-cream">
        Where should we send your guide?
      </h2>
      <p className="mt-2 text-muted text-sm">
        We&rsquo;ll email your full concept as a designed PDF and reveal it here now.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-hairline bg-surface text-cream px-4 py-3 focus:border-gold outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-hairline bg-surface text-cream px-4 py-3 focus:border-gold outline-none"
          />
        </div>
        <div>
          <label htmlFor="suburb" className="block text-sm font-medium mb-1">
            Suburb or postcode <span className="text-muted font-normal">(optional)</span>
          </label>
          <input
            id="suburb"
            type="text"
            autoComplete="postal-code"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
            className="w-full border border-hairline bg-surface text-cream px-4 py-3 focus:border-gold outline-none"
          />
        </div>
        <div>
          <label htmlFor="budget" className="block text-sm font-medium mb-1">
            Rough budget <span className="text-muted font-normal">(optional)</span>
          </label>
          <select
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full border border-hairline bg-surface text-cream px-4 py-3 focus:border-gold outline-none appearance-none"
          >
            <option value="">Prefer not to say</option>
            {budgetOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Honeypot: hidden from humans, tempting to bots. */}
        <div aria-hidden className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-cream cursor-pointer">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-5 w-5 accent-gold shrink-0"
          />
          <span>
            Yes, email me my guide and the occasional note from Landart. I can
            unsubscribe any time. See our{" "}
            <a
              href={site.privacyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gold"
            >
              privacy policy
            </a>
            .
          </span>
        </label>
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-cream border border-gold bg-gold/15 px-4 py-3">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={submitting} className="btn-gold w-full mt-6">
        {submitting ? "Shaping your guide…" : "Reveal my full concept"}
      </button>
    </form>
  );
}
