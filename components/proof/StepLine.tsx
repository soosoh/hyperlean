"use client";

import type { KeyboardEvent } from "react";
import { CheckCircle2, CircleHelp, XCircle } from "lucide-react";
import type { RuleType } from "@/types";

const RULES: Array<{ value: RuleType; label: string }> = [
  { value: "ModusPonens", label: "Modus Ponens" },
  { value: "Substitution", label: "Substitution" },
  { value: "Axiom", label: "Axiom" },
];

export type StepStatus = "unknown" | "valid" | "invalid";

interface StepLineProps {
  index: number;
  formula: string;
  rule: RuleType;
  status: StepStatus;
  message?: string;
  focused: boolean;
  inputRef: (element: HTMLInputElement | null) => void;
  onChange: (formula: string) => void;
  onRuleChange: (rule: RuleType) => void;
  onFocusLine: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export function StepLine({
  index,
  formula,
  rule,
  status,
  message,
  focused,
  inputRef,
  onChange,
  onRuleChange,
  onFocusLine,
  onKeyDown,
  onRemove,
}: StepLineProps) {
  const statusIcon =
    status === "valid" ? (
      <CheckCircle2 size={16} className="text-success" aria-label="valid step" />
    ) : status === "invalid" ? (
      <XCircle size={16} className="text-error" aria-label="invalid step" />
    ) : (
      <CircleHelp
        size={16}
        className="text-slate-500"
        aria-label="unchecked step"
      />
    );

  return (
    <div
      className={`rounded-lg border px-3 py-2 transition-colors ${
        focused
          ? "border-primary/70 bg-slate-900/70"
          : "border-slate-800 bg-card/40"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="w-6 shrink-0 text-right font-mono text-xs text-slate-500">
          {index + 1}.
        </span>
        <input
          ref={inputRef}
          value={formula}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocusLine}
          onKeyDown={onKeyDown}
          placeholder="e.g. A → B"
          aria-label={`Formula for line ${index + 1}`}
          spellCheck={false}
          className="min-w-0 flex-1 rounded-md border border-slate-700 bg-bg px-2 py-1.5 font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:border-primary focus:outline-none"
        />
        <select
          value={rule}
          onChange={(event) => onRuleChange(event.target.value as RuleType)}
          aria-label={`Inference rule for line ${index + 1}`}
          className="rounded-md border border-slate-700 bg-bg px-2 py-1.5 text-xs text-slate-200 focus:border-primary focus:outline-none"
        >
          {RULES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="flex w-5 shrink-0 justify-center">{statusIcon}</span>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 text-xs text-slate-500 hover:text-error"
          aria-label={`Remove line ${index + 1}`}
        >
          ✕
        </button>
      </div>
      {status === "invalid" && message ? (
        <p className="mt-1 pl-8 text-xs text-error/90">{message}</p>
      ) : null}
    </div>
  );
}
