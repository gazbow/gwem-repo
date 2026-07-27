"use client";

import type { Question } from "@/lib/types";
import { Icon } from "@/components/Icon";

// A single question screen: large visual choice tiles (Build Spec sections 3 & 4).
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

  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl leading-tight text-charcoal">
        {question.title}
      </h1>
      <p className="mt-2 text-muted text-sm sm:text-base">{question.helper}</p>

      <div
        role={multi ? "group" : "radiogroup"}
        aria-label={question.title}
        className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
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
              className={`flex items-center gap-4 border-2 p-4 text-left min-h-[76px] transition-colors
                ${
                  isSelected
                    ? "border-gold bg-panel"
                    : "border-hairline bg-surface hover:border-charcoal"
                }
                ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <span
                className={`shrink-0 ${isSelected ? "text-gold" : "text-charcoal"}`}
              >
                <Icon name={opt.icon} size={34} />
              </span>
              <span>
                <span className="block font-medium text-charcoal">{opt.label}</span>
                {opt.helper ? (
                  <span className="block text-sm text-muted mt-0.5">{opt.helper}</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      {multi ? (
        <p className="mt-4 text-xs text-muted" aria-live="polite">
          {question.maxSelect
            ? `Choose up to ${question.maxSelect}. ${selected.length} selected.`
            : `Choose any that apply. ${selected.length} selected.`}
        </p>
      ) : null}
    </div>
  );
}
