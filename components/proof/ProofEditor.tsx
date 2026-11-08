"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Lightbulb, Plus, RotateCcw, ShieldCheck } from "lucide-react";
import type { ProofStep, RuleType, Theorem } from "@/types";
import { formulasEqual, validateStep } from "@/lib/proof-validator";
import { MAX_HINTS, remainingCooldownSeconds } from "@/lib/hints";
import { axioms } from "@/data/axioms";
import { useProofStore } from "@/store/proof";
import { StepLine } from "./StepLine";
import type { StepStatus } from "./StepLine";

const HINTS = [
  "Look for an implication (A → B) in your premises, then check whether its antecedent A is available.",
  "The target may be an instance of an axiom schema. Try the Axiom rule and compare shapes.",
  "Substitution renames variables consistently across an entire formula — no partial renames.",
];

interface DraftLine {
  formula: string;
  rule: RuleType;
}

interface ProofEditorProps {
  theorem: Theorem;
  initialPremises: string[];
  onSolved?: (id: string) => void;
}

export function ProofEditor({
  theorem,
  initialPremises,
  onSolved,
}: ProofEditorProps) {
  const hintsUsed = useProofStore((state) => state.hintsUsed);
  const cooldownUntil = useProofStore((state) => state.cooldownUntil);
  const requestHintAction = useProofStore((state) => state.useHint);
  const setValidationState = useProofStore((state) => state.setValidationState);
  const setResult = useProofStore((state) => state.setResult);
  const resetProof = useProofStore((state) => state.resetProof);

  const [premises, setPremises] = useState(initialPremises.join("\n"));
  const [lines, setLines] = useState<DraftLine[]>([
    { formula: "", rule: "Axiom" },
  ]);
  const [statuses, setStatuses] = useState<StepStatus[]>(["unknown"]);
  const [messages, setMessages] = useState<Array<string | undefined>>([
    undefined,
  ]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [solvedBanner, setSolvedBanner] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cooldownSeconds = remainingCooldownSeconds(cooldownUntil, now);
  const hintsLeft = Math.max(0, MAX_HINTS - hintsUsed);
  const hintsBlocked = hintsLeft === 0 || cooldownSeconds > 0;

  const updateLine = useCallback((index: number, formula: string) => {
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, formula } : line)),
    );
    setStatuses((prev) =>
      prev.map((status, i) => (i === index ? "unknown" : status)),
    );
    setMessages((prev) =>
      prev.map((message, i) => (i === index ? undefined : message)),
    );
    setSolvedBanner(false);
  }, []);

  const updateRule = useCallback((index: number, rule: RuleType) => {
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, rule } : line)),
    );
    setStatuses((prev) =>
      prev.map((status, i) => (i === index ? "unknown" : status)),
    );
    setMessages((prev) =>
      prev.map((message, i) => (i === index ? undefined : message)),
    );
    setSolvedBanner(false);
  }, []);

  const addLine = useCallback(() => {
    setLines((prev) => [...prev, { formula: "", rule: "Axiom" }]);
    setStatuses((prev) => [...prev, "unknown"]);
    setMessages((prev) => [...prev, undefined]);
  }, []);

  const removeLine = useCallback((index: number) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
    setStatuses((prev) => prev.filter((_, i) => i !== index));
    setMessages((prev) => prev.filter((_, i) => i !== index));
    setSolvedBanner(false);
  }, []);

  const validate = useCallback(() => {
    const premiseList = premises
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const context = [...premiseList];
    const nextStatuses: StepStatus[] = [];
    const nextMessages: Array<string | undefined> = [];
    let allValid = true;
    let lastFormula = "";

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      if (line.formula.trim().length === 0) {
        nextStatuses.push("unknown");
        nextMessages.push(undefined);
        allValid = false;
        continue;
      }

      const step: ProofStep = {
        id: `line-${index}`,
        formula: line.formula,
        rule: line.rule,
        justification: "",
        lineNumber: index + 1,
        dependsOn: [],
      };

      const result = validateStep(step, context, axioms);
      if (result.valid) {
        nextStatuses.push("valid");
        nextMessages.push(undefined);
        context.push(line.formula);
        lastFormula = line.formula;
      } else {
        nextStatuses.push("invalid");
        nextMessages.push(result.reason);
        allValid = false;
      }
    }

    setStatuses(nextStatuses);
    setMessages(nextMessages);
    setValidationState(allValid ? "valid" : "invalid");

    const reachesTarget =
      allValid &&
      lastFormula.length > 0 &&
      formulasEqual(lastFormula, theorem.targetConclusion);

    setResult(
      reachesTarget
        ? { valid: true }
        : {
            valid: false,
            reason: allValid
              ? `Proof is valid, but the last line does not match the target: ${theorem.targetConclusion}`
              : "Some proof steps are invalid.",
          },
    );

    setSolvedBanner(reachesTarget);
    if (reachesTarget) onSolved?.(theorem.id);
  }, [premises, lines, theorem, setValidationState, setResult, onSolved]);

  const requestHint = useCallback(() => {
    const allowed = requestHintAction();
    if (!allowed) {
      setHint(
        "No hints available right now. Wait for the cooldown or reset the proof.",
      );
      return;
    }
    setHint(HINTS[Math.min(hintsUsed, HINTS.length - 1)]);
  }, [requestHintAction, hintsUsed]);

  const reset = useCallback(() => {
    setLines([{ formula: "", rule: "Axiom" }]);
    setStatuses(["unknown"]);
    setMessages([undefined]);
    setFocusedIndex(0);
    setHint(null);
    setSolvedBanner(false);
    resetProof();
    inputRefs.current[0]?.focus();
  }, [resetProof]);

  const handleLineKeyDown =
    (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Tab") return;
      event.preventDefault();
      const nextIndex = index + (event.shiftKey ? -1 : 1);
      if (nextIndex >= 0 && nextIndex < lines.length) {
        inputRefs.current[nextIndex]?.focus();
        setFocusedIndex(nextIndex);
      }
    };

  const handlePanelKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      validate();
    }
  };

  return (
    <section
      aria-label={`Proof editor for ${theorem.title}`}
      onKeyDown={handlePanelKeyDown}
      className="flex h-full flex-col rounded-2xl border border-slate-800 bg-card/60"
    >
      <header className="border-b border-slate-800 px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              {theorem.title}
            </h2>
            <p className="text-xs text-slate-500">
              {theorem.category} · Difficulty {theorem.difficulty}
            </p>
          </div>
          <div className="text-right text-xs">
            <span className="block uppercase tracking-wide text-slate-500">
              Target
            </span>
            <code className="font-mono text-sm text-success">
              {theorem.targetConclusion}
            </code>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-400">{theorem.description}</p>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Premises (one per line)
          </span>
          <textarea
            value={premises}
            onChange={(event) => setPremises(event.target.value)}
            rows={Math.min(Math.max(initialPremises.length, 2), 5)}
            spellCheck={false}
            placeholder={"A → B\nA"}
            className="w-full resize-y rounded-md border border-slate-700 bg-bg px-2 py-1.5 font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:border-primary focus:outline-none"
          />
        </label>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Proof steps
            </span>
            <button
              type="button"
              onClick={addLine}
              className="flex items-center gap-1 rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
            >
              <Plus size={12} /> Add line
            </button>
          </div>
          {lines.map((line, index) => (
            <StepLine
              key={index}
              index={index}
              formula={line.formula}
              rule={line.rule}
              status={statuses[index] ?? "unknown"}
              message={messages[index]}
              focused={focusedIndex === index}
              inputRef={(element) => {
                inputRefs.current[index] = element;
              }}
              onChange={(formula) => updateLine(index, formula)}
              onRuleChange={(rule) => updateRule(index, rule)}
              onFocusLine={() => setFocusedIndex(index)}
              onKeyDown={handleLineKeyDown(index)}
              onRemove={() => removeLine(index)}
            />
          ))}
        </div>

        {solvedBanner ? (
          <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">
            <ShieldCheck size={16} /> Theorem proved! {theorem.title} marked
            complete.
          </div>
        ) : null}

        {hint ? (
          <div className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary">
            <span className="font-semibold">Hint:</span> {hint}
          </div>
        ) : null}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={requestHint}
            disabled={hintsBlocked}
            className="flex items-center gap-1 rounded-md border border-slate-700 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Lightbulb size={14} />
            Hint ({hintsLeft} left{cooldownSeconds > 0 ? ` · ${cooldownSeconds}s` : ""})
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1 rounded-md border border-slate-700 px-2.5 py-1.5 text-xs text-slate-400 hover:bg-slate-800"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
        <button
          type="button"
          onClick={validate}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Validate · Ctrl/Cmd + Enter
        </button>
      </footer>
    </section>
  );
}
