"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ValidationResult } from "@/types";
import { canUseHint, nextHintState } from "@/lib/hints";

export type ValidationState = "idle" | "valid" | "invalid" | "validating";

interface ProofState {
  currentProof: string[];
  hintsUsed: number;
  cooldownUntil: number | null;
  validationState: ValidationState;
  result: ValidationResult | null;
  addStep: (formula: string) => void;
  setStep: (index: number, formula: string) => void;
  useHint: () => boolean;
  setValidationState: (state: ValidationState) => void;
  setResult: (result: ValidationResult | null) => void;
  resetProof: () => void;
}

export const useProofStore = create<ProofState>()(
  persist(
    (set, get) => ({
      currentProof: [],
      hintsUsed: 0,
      cooldownUntil: null,
      validationState: "idle",
      result: null,
      addStep: (formula) =>
        set((state) => ({ currentProof: [...state.currentProof, formula] })),
      setStep: (index, formula) =>
        set((state) => {
          const next = [...state.currentProof];
          if (index >= 0 && index < next.length) next[index] = formula;
          return { currentProof: next };
        }),
      useHint: () => {
        const { hintsUsed, cooldownUntil } = get();
        if (!canUseHint(hintsUsed, cooldownUntil)) return false;
        set(nextHintState(hintsUsed));
        return true;
      },
      setValidationState: (validationState) => set({ validationState }),
      setResult: (result) => set({ result }),
      resetProof: () =>
        set({
          currentProof: [],
          hintsUsed: 0,
          cooldownUntil: null,
          validationState: "idle",
          result: null,
        }),
    }),
    { name: "hyperlean-proof" },
  ),
);
