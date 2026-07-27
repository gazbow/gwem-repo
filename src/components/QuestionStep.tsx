"use client";

import { IconCheck } from "@tabler/icons-react";
import type { Question } from "@/lib/types";
import { Icon } from "@/components/Icon";

// A single question screen: large visual choice tiles (Build Spec sections 3 & 4).
// Multi-select is made obvious with a pill under the question and a checkbox on each tile.
// Keyboard + ARIA support for the choice group (accessibility, section 11).

export function QuestionStep({
  question,
  selected,
  onToggle,
}: {
  question: Question;
  selected: string[];
  onToggle: (optionId: string) => void;
}) {
  const multi = Boolean(question.multiSelect);
  const atMax =
    multi && question.maxSelect ? selected.length >= question.maxSelect : false;

  const multiLabel = question.maxSelect
    ? `Choose up to ${question.maxSelect}`
    : "Choose all that apply";

  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl leading-tight text-charcoal">
        {question.title}
      </h1>
      <p className="mt-2 text-muted text-sm sm:text-base">{question.helper}</p>

      {/* Prominent multi-select callout — a gold pill that's hard to miss. */}
      {multi ? (
        <div className="mt-4 flex items-center gap-2" aria-live="polite">
          <span className="inline-flex items-center gap-2 bg-gold/15 border border-gold text-charcoal text-xs font-semibold uppercase tracking-label px-3 py-1.5">
            <IconCheck size={14} stroke={2.5} aria-hidden />
            {multiLabel}
          </span>
          <span className="text-xs text-muted">
            {selected.length} selected
          </span>
        </div>
      ) : null}

      <div
        role={multi ? "group" : "radiogroup"}
        aria-label={question.title}
        className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {question.options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const disabled = !isSelected && atMax;
          return (
            <button
              key={opt.id}
              type="button"
              role={multi ? "checkbox" : "radio"}
              aria-checked={isSelected}
              aria-disabled={disabled}
              disabled={disabled}
              onClick={() => onToggle(opt.id)}
              className={`relative flex items-center gap-4 border-2 p-4 pr-11 text-left min-h-[76px] transition-colors
                ${
                  isSelected
                    ? "border-gold bg-panel"
                    : "border-hairline bg-surface hover:border-charcoal"
                }
                ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <span className={`shrink-0 ${isSelected ? "text-gold" : "text-charcoal"}`}>
                <Icon name={opt.icon} size={34} />
              </span>
              <span>
                <span className="block font-medium text-charcoal">{opt.label}</span>
                {opt.helper ? (
                  <span className="block text-sm text-muted mt-0.5">{opt.helper}</span>
                ) : null}
              </span>

              {/* Selection indicator: a checkbox for multi-select, a radio dot for single. */}
              <span
                className={`absolute top-3 right-3 flex items-center justify-center h-5 w-5 border-2 ${
                  multi ? "" : "rounded-full"
                } ${isSelected ? "border-gold bg-gold text-charcoal" : "border-hairline bg-surface"}`}
                aria-hidden
              >
                {isSelected ? (
                  multi ? (
                    <IconCheck size={13} stroke={3} />
                  ) : (
                    <span className="h-2 w-2 bg-charcoal rounded-full" />
                  )
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
