"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Answers, GuideResult } from "@/lib/types";
import { questions } from "@/data/questions";
import { generateResult } from "@/lib/engine";
import { analytics } from "@/lib/analytics";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionStep } from "@/components/QuestionStep";
import { ResultPreview } from "@/components/ResultPreview";
import { CaptureForm } from "@/components/CaptureForm";
import { FullResult } from "@/components/FullResult";
import { site } from "@/data/config";

type Stage = "landing" | "questions" | "building" | "gate" | "result";

const STORAGE_KEY = "landart-guide-v1";
const BUILD_MS = 1400; // "Shaping your concept…" — keep under ~1.5s (Build Spec section 3).

interface PersistedState {
  stage: Stage;
  step: number;
  answers: Answers;
}

export function Guide() {
  const [stage, setStage] = useState<Stage>("landing");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [previewResult, setPreviewResult] = useState<GuideResult | null>(null);
  const [finalResult, setFinalResult] = useState<GuideResult | null>(null);
  const [utm, setUtm] = useState<Record<string, string>>({});
  const startedRef = useRef(false);
  const liveRef = useRef<HTMLDivElement>(null);

  // Restore progress on mount (sessionStorage) + capture UTM params for attribution.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw) as PersistedState;
        // Never restore straight into building/result — resume at questions or gate.
        if (p.stage === "questions" || p.stage === "gate") {
          setAnswers(p.answers ?? {});
          setStep(p.step ?? 0);
          setStage(p.stage);
          if (Object.keys(p.answers ?? {}).length) startedRef.current = true;
        }
      }
    } catch {
      /* ignore corrupt state */
    }
    const params = new URLSearchParams(window.location.search);
    const captured: Record<string, string> = {};
    params.forEach((v, k) => {
      if (k.startsWith("utm_")) captured[k] = v;
    });
    if (Object.keys(captured).length) setUtm(captured);
  }, []);

  // Persist progress.
  useEffect(() => {
    if (stage === "landing") return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ stage, step, answers }));
    } catch {
      /* storage may be unavailable */
    }
  }, [stage, step, answers]);

  const current = questions[step];

  const canAdvance = useMemo(() => {
    if (!current) return false;
    return (answers[current.id]?.length ?? 0) > 0;
  }, [current, answers]);

  const toggleOption = useCallback(
    (optionId: string) => {
      if (!current) return;
      if (!startedRef.current) {
        startedRef.current = true;
        analytics.guideStart();
      }
      setAnswers((prev) => {
        const existing = prev[current.id] ?? [];
        if (current.multiSelect) {
          const isOn = existing.includes(optionId);
          let next = isOn
            ? existing.filter((id) => id !== optionId)
            : [...existing, optionId];
          if (current.maxSelect && next.length > current.maxSelect) {
            next = next.slice(next.length - current.maxSelect);
          }
          return { ...prev, [current.id]: next };
        }
        return { ...prev, [current.id]: [optionId] };
      });
    },
    [current],
  );

  const goNext = useCallback(() => {
    if (!canAdvance) return;
    analytics.guideStep(step + 1);
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
    } else {
      // Building transition, then generate the preview.
      setStage("building");
      window.setTimeout(() => {
        const result = generateResult(answers);
        setPreviewResult(result);
        analytics.guideComplete(result.style.name);
        setStage("gate");
      }, BUILD_MS);
    }
  }, [canAdvance, step, answers]);

  const goBack = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
    else setStage("landing");
  }, [step]);

  // Auto-advance single-select questions once a choice is made (feels quick on mobile).
  const handleToggle = useCallback(
    (optionId: string) => {
      toggleOption(optionId);
      if (current && !current.multiSelect) {
        window.setTimeout(() => {
          analytics.guideStep(step + 1);
          if (step < questions.length - 1) setStep((s) => s + 1);
          else {
            setStage("building");
            window.setTimeout(() => {
              setAnswers((latest) => {
                const result = generateResult(latest);
                setPreviewResult(result);
                analytics.guideComplete(result.style.name);
                setStage("gate");
                return latest;
              });
            }, BUILD_MS);
          }
        }, 220);
      }
    },
    [toggleOption, current, step],
  );

  function reset() {
    sessionStorage.removeItem(STORAGE_KEY);
    setAnswers({});
    setStep(0);
    setPreviewResult(null);
    setFinalResult(null);
    startedRef.current = false;
    setStage("landing");
  }

  // --- Render ---------------------------------------------------------------

  return (
    <main className="min-h-screen">
      {/* Slim brand bar */}
      <div className="border-b border-hairline bg-page">
        <div className="mx-auto max-w-3xl px-5 py-4 flex items-center justify-between">
          <span className="font-display text-xl tracking-[0.2em] text-charcoal">
            LANDART
          </span>
          {stage !== "landing" ? (
            <button
              type="button"
              onClick={reset}
              className="text-xs uppercase tracking-label text-muted hover:text-charcoal"
            >
              Start over
            </button>
          ) : null}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-8 sm:py-12">
        {stage === "landing" && <Landing onStart={() => setStage("questions")} />}

        {stage === "questions" && current && (
          <div>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="label-eyebrow">
                  Step {step + 1} of {questions.length}
                </span>
              </div>
              <ProgressBar current={step + 1} total={questions.length} />
            </div>

            <QuestionStep
              question={current}
              selected={answers[current.id] ?? []}
              onToggle={handleToggle}
            />

            <div className="mt-8 flex items-center justify-between">
              <button type="button" onClick={goBack} className="btn-ghost">
                Back
              </button>
              {current.multiSelect ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canAdvance}
                  className="btn-primary"
                >
                  {step === questions.length - 1 ? "See my concept" : "Continue"}
                </button>
              ) : (
                <span className="text-xs text-muted">Tap a tile to continue</span>
              )}
            </div>
          </div>
        )}

        {stage === "building" && <Building />}

        {stage === "gate" && previewResult && (
          <div className="space-y-8">
            <ResultPreview result={previewResult} />
            <div
              ref={liveRef}
              aria-live="polite"
              className="scroll-mt-8"
              id="capture"
            >
              <CaptureForm
                answers={answers}
                utm={utm}
                onSuccess={(result) => {
                  setFinalResult(result);
                  setStage("result");
                }}
              />
            </div>
          </div>
        )}

        {stage === "result" && finalResult && (
          <div>
            <FullResult result={finalResult} />
            <p className="mt-8 text-center text-sm text-muted">
              A copy is on its way to your inbox. Prefer to talk now?{" "}
              <a href={site.landartUrl} className="underline hover:text-gold">
                Book a consult
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center py-8 sm:py-16">
      <p className="label-eyebrow">Landart Garden Guide</p>
      <h1 className="font-display text-4xl sm:text-6xl mt-4 leading-tight text-charcoal">
        Picture your garden
        <br /> in two minutes
      </h1>
      <p className="mt-5 text-muted max-w-xl mx-auto leading-relaxed">
        Answer a few quick questions about your outdoor space and we&rsquo;ll shape a
        tailored concept direction — planting, features and style, matched to your
        corner of Sydney.
      </p>
      <div className="mt-8">
        <button type="button" onClick={onStart} className="btn-primary">
          Start the guide
        </button>
      </div>
      <p className="mt-4 text-sm text-muted">Takes about two minutes. No jargon.</p>
    </div>
  );
}

function Building() {
  return (
    <div
      className="py-24 text-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex justify-center gap-1.5 mb-6" aria-hidden>
        <span className="h-2 w-2 bg-gold animate-pulse" />
        <span className="h-2 w-2 bg-gold animate-pulse [animation-delay:150ms]" />
        <span className="h-2 w-2 bg-gold animate-pulse [animation-delay:300ms]" />
      </div>
      <p className="font-display text-2xl text-charcoal">Shaping your concept…</p>
    </div>
  );
}
