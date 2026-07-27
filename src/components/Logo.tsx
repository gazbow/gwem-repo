"use client";

import { useState } from "react";

// Renders the Landart logo from /public/landart-logo.png. If the file isn't present
// (or fails to load), it falls back to the "LANDART" text wordmark so nothing breaks.
export function Logo({ className = "", height = 28 }: { className?: string; height?: number }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`font-display tracking-[0.2em] text-charcoal ${className}`}
        style={{ fontSize: height * 0.72 }}
      >
        LANDART
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/landart-logo.png"
      alt="Landart"
      style={{ height, width: "auto" }}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
