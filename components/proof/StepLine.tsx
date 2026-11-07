"use client";

import { useState } from "react";
import type {
  CSSProperties,
  KeyboardEvent,
  ReactElement,
  ReactNode,
} from "react";
import type { RuleType, ValidationResult } from "@/types";

export type EditorStep = {
  id: string;
  formula: string;
  rule: RuleType;
  justification: string;
};

type StepLineProps = {
  step: EditorStep;
  index: number;
  result: ValidationResult | null;
  onChange: (patch: Partial<EditorStep>) => void;
  onRemove: () => void;
  onFocus: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
};

const RULE_OPTIONS: ReadonlyArray<{ value: RuleType; label: string }> = [
  { value: "ModusPonens", label: "Modus Ponens" },
  { value: "Substitution", label: "Substitution" },
  { value: "Axiom", label: "Axiom" },
];

const ATOM_TOKEN = /^[A-Za-z0-9_]+$/;
const OPERATOR_TOKEN = /^[→↔∧∨¬∀∃⊢]$/;
const PAREN_TOKEN = /^[()[\]{}]$/;
const LOWER_ATOM = /^[a-z][A-Za-z0-9_]*$/;

function highlightFormula(formula: string): ReactNode[] {
  const tokens = formula.match(/[A-Za-z0-9_]+|[→↔∧∨¬∀∃⊢]|[()[\]{}]|\s+|./g) ?? [];

  return tokens.map((token, index) => {
    let color = "#F8FAFC";

    if (OPERATOR_TOKEN.test(token)) {
      color = "#60A5FA";
    } else if (PAREN_TOKEN.test(token)) {
      color = "#94A3B8";
    } else if (ATOM_TOKEN.test(token) && LOWER_ATOM.test(token)) {
      color = "#FCD34D";
    }

    return (
      <span key={`${index}-${token}`} style={{ color }}>
        {token}
      </span>
    );
  });
}

function fieldStyle(focused: boolean): CSSProperties {
  return {
    backgroundColor: "#0F172A",
    color: "#F8FAFC",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: focused ? "#3B82F6" : "#334155",
    borderRadius: 6,
    padding: "6px 8px",
    fontSize: 13,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    outline: "none",
    boxShadow: focused ? "0 0 0 2px rgba(59, 130, 246, 0.6)" : "none",
    width: "100%",
    boxSizing: "border-box",
  };
}

function statusVisual(result: ValidationResult | null): {
  symbol: string;
  color: string;
  label: string;
} {
  if (result === null) {
    return { symbol: "•", color: "#94A3B8", label: "Not validated yet" };
  }
  if (result.valid) {
    return { symbol: "✓", color: "#10B981", label: "Valid step" };
  }
  return { symbol: "✕", color: "#EF4444", label: "Invalid step" };
}

export function StepLine({
  step,
  index,
  result,
  onChange,
  onRemove,
  onFocus,
  onKeyDown,
}: StepLineProps): ReactElement {
  const [focusedField, setFocusedField] = useState<
    "formula" | "rule" | "justification" | null
  >(null);

  const status = statusVisual(result);
  const errorId = `step-${step.id}-error`;

  return (
    <li
      style={{
        backgroundColor: "#1E293B",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: focusedField === null ? "#334155" : "#3B82F6",
        borderRadius: 10,
        padding: 12,
        listStyle: "none",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span
          aria-hidden="true"
          style={{
            color: "#94A3B8",
            fontSize: 12,
            fontVariantNumeric: "tabular-nums",
            minWidth: 18,
            paddingTop: 6,
            textAlign: "right",
          }}
        >
          {index + 1}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={step.formula}
              onChange={(event) => onChange({ formula: event.target.value })}
              onFocus={() => {
                setFocusedField("formula");
                onFocus();
              }}
              onBlur={() => setFocusedField(null)}
              onKeyDown={onKeyDown}
              placeholder="e.g. A → B"
              aria-label={`Step ${index + 1} formula`}
              aria-invalid={result !== null && !result.valid}
              aria-describedby={result !== null && !result.valid ? errorId : undefined}
              spellCheck={false}
              autoComplete="off"
              style={{ ...fieldStyle(focusedField === "formula"), flex: 1 }}
            />

            <select
              value={step.rule}
              onChange={(event) =>
                onChange({ rule: event.target.value as RuleType })
              }
              onFocus={() => {
                setFocusedField("rule");
                onFocus();
              }}
              onBlur={() => setFocusedField(null)}
              onKeyDown={onKeyDown}
              aria-label={`Step ${index + 1} rule`}
              style={{
                ...fieldStyle(focusedField === "rule"),
                width: 150,
                flexShrink: 0,
              }}
            >
              {RULE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <input
            value={step.justification}
            onChange={(event) => onChange({ justification: event.target.value })}
            onFocus={() => {
              setFocusedField("justification");
              onFocus();
            }}
            onBlur={() => setFocusedField(null)}
            onKeyDown={onKeyDown}
            placeholder="Justification: line numbers or axiom id"
            aria-label={`Step ${index + 1} justification`}
            spellCheck={false}
            autoComplete="off"
            style={{ ...fieldStyle(focusedField === "justification"), marginTop: 8 }}
          />

          {step.formula.trim().length > 0 && (
            <pre
              aria-hidden="true"
              style={{
                margin: "8px 0 0",
                padding: "6px 8px",
                backgroundColor: "#0F172A",
                borderRadius: 6,
                fontSize: 13,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                overflowX: "auto",
              }}
            >
              {highlightFormula(step.formula)}
            </pre>
          )}

          {result !== null && !result.valid && result.reason !== undefined && (
            <p id={errorId} style={{ margin: "6px 0 0", color: "#EF4444", fontSize: 12 }}>
              {result.reason}
            </p>
          )}
        </div>

        <span
          title={status.label}
          aria-label={status.label}
          style={{ color: status.color, fontSize: 16, paddingTop: 4, minWidth: 16 }}
        >
          {status.symbol}
        </span>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove step ${index + 1}`}
          style={{
            background: "transparent",
            border: "none",
            color: "#94A3B8",
            cursor: "pointer",
            fontSize: 16,
            padding: "4px 6px",
            borderRadius: 6,
          }}
        >
          ×
        </button>
      </div>
    </li>
  );
}
