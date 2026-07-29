// Thin gold progress segments (Build Spec section 4). Announced to screen readers.
export function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`Step ${current} of ${total}`}
      className="flex gap-1.5"
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-0.5 flex-1 transition-colors ${
            i < current ? "bg-gold" : "bg-hairline"
          }`}
        />
      ))}
    </div>
  );
}
