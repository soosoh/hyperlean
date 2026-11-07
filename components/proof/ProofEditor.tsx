"use client";

import { useCallback, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactElement } from "react";
import type { Axiom, RuleType, ValidationResult } from "@/types";
import { validateStep } from "@/lib/proof-validator";
import { StepLine } from "./StepLine";
import type { EditorStep } from "./StepLine";

type ProofEditorProps = {
  theoremTitle?: string;
  targetConclusion?: string;
  axioms?: Axiom[];
};

function createInitialSteps(): EditorStep[] {
  return [
    { id: "step-initial-1", formula: "", rule: "ModusPonens", justification: "" },
    { id: "step-initial-2", formula: "", rule: "ModusPonens", justification: "" },
  ];
}

function buttonStyle(primary: boolean): CSSProperties {
  return {
    backgroundColor: primary ? "#3B82F6" : "transparent",
    color: primary ? "#F8FAFC" : "#CBD5E1",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: primary ? "#3B82F6" : "#334155",
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  };
}

export function ProofEditor({
  theoremTitle = "Untitled theorem",
  targetConclusion,
  axioms = [],
}: ProofEditorProps): ReactElement {
  const [steps, setSteps] = useState<EditorStep[]>(createInitialSteps);
  const [results, setResults] = useState<Record<string, ValidationResult> | null>(
    null
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const nextId = useRef(3);

  const invalidate = useCallback((): void => {
    setResults(null);
  }, []);

  const updateStep = useCallback(
    (index: number, patch: Partial<EditorStep>): void => {
      setSteps((current) =>
        current.map((step, i) => (i === index ? { ...step, ...patch } : step))
      );
      invalidate();
    },
    [invalidate]
  );

  const addStep = useCallback((): void => {
    setSteps((current) => [
      ...current,
      {
        id: `step-${nextId.current}`,
        formula: "",
        rule: "ModusPonens",
        justification: "",
      },
    ]);
    nextId.current += 1;
    invalidate();
  }, [invalidate]);

  const removeStep = useCallback(
    (index: number): void => {
      setSteps((current) => {
        if (current.length === 1) {
          return [
            {
              id: `step-${nextId.current}`,
              formula: "",
              rule: "ModusPonens",
              justification: "",
            },
          ];
        }
        return current.filter((_, i) => i !== index);
      });
      nextId.current += 1;
      invalidate();
    },
    [invalidate]
  );

  const validateAll = useCallback((): void => {
    const context: string[] = [];
    const nextResults: Record<string, ValidationResult> = {};

    steps.forEach((step, index) => {
      if (step.formula.trim().length === 0) {
        nextResults[step.id] = {
          valid: false,
          reason: "Add a formula for this line before validating.",
        };
        return;
      }

      nextResults[step.id] = validateStep(
        {
          id: step.id,
          formula: step.formula,
          rule: step.rule,
          justification: step.justification,
          lineNumber: index + 1,
          dependsOn: [],
        },
        [...context],
        axioms
      );

      context.push(step.formula);
    });

    setResults(nextResults);
  }, [steps, axioms]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>): void => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        validateAll();
      }
    },
    [validateAll]
  );

  const checked = results === null ? 0 : Object.keys(results).length;
  const validCount =
    results === null
      ? 0
      : Object.values(results).filter((result) => result.valid).length;
  const allValid = results !== null && checked > 0 && validCount === checked;

  return (
    <section
      aria-label={`Proof editor for ${theoremTitle}`}
      onKeyDown={handleKeyDown}
      style={{
        maxWidth: 760,
        margin: "0 auto",
        color: "#F8FAFC",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>{theoremTitle}</h1>
        {targetConclusion !== undefined && (
          <p style={{ margin: "6px 0 0", color: "#94A3B8", fontSize: 14 }}>
            Target: <code style={{ color: "#10B981" }}>{targetConclusion}</code>
          </p>
        )}
      </header>

      <ol style={{ margin: 0, padding: 0, display: "grid", gap: 10 }}>
        {steps.map((step, index) => (
          <StepLine
            key={step.id}
            step={step}
            index={index}
            result={results?.[step.id] ?? null}
            onChange={(patch) => updateStep(index, patch)}
            onRemove={() => removeStep(index)}
            onFocus={() => setActiveIndex(index)}
            onKeyDown={handleKeyDown}
          />
        ))}
      </ol>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 16,
          flexWrap: "wrap",
        }}
      >
        <button type="button" onClick={addStep} style={buttonStyle(false)}>
          + Add step
        </button>
        <button type="button" onClick={validateAll} style={buttonStyle(true)}>
          Validate proof
        </button>
        <span style={{ color: "#64748B", fontSize: 12 }}>
          Ctrl/Cmd + Enter
        </span>

        {results !== null && (
          <span
            role="status"
            aria-live="polite"
            style={{
              marginLeft: "auto",
              color: allValid ? "#10B981" : "#EF4444",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {validCount} / {checked} steps valid
          </span>
        )}
      </div>

      <p style={{ marginTop: 12, color: "#64748B", fontSize: 12 }}>
        Active line: {activeIndex + 1}. Use Tab / Shift+Tab to move between
        fields and lines; every field shows a focus ring.
      </p>
    </section>
  );
}
