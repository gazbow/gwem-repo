"use client";

import { useState } from "react";

// The tag-matched hero image. If the file isn't present yet it renders nothing
// (no broken-image icon), so photos can be added one at a time.
export function GardenHero({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <div className={`overflow-hidden bg-panel ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onError={() => setFailed(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
