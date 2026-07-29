"use client";

import { useState } from "react";

// Renders the Landart logo from /public/landart-logo.png. If the file isn't present
// (or fails to load), it falls back to the "LANDART" text wordmark so nothing breaks.
//
// The supplied logo is a dark (charcoal) monochrome mark. On the dark UI it would be
// invisible, so by default we invert it to off-white. If a colour logo is supplied
// later, pass `invert={false}` (or drop a pre-reversed white file in).
export function Logo({
  className = "",
  height = 28,
  invert = true,
}: {
  className?: string;
  height?: number;
  invert?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`font-display tracking-[0.2em] text-cream ${className}`}
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
      style={{
        height,
        width: "auto",
        // brightness(0) flattens the charcoal mark to black, invert(1) turns it off-white.
        filter: invert ? "brightness(0) invert(0.93)" : undefined,
      }}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
