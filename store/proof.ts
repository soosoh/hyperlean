import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { canUseHint as checkHint, nextHintState } from "@/lib/hints";

export type ValidationState = "idle" | "valid" | "invalid" | "validating";

export type ProofState = {
  currentProof: string[];
  hintsUsed: number;
  cooldownUntil: number | null;
  validationState: ValidationState;
  addStep: (step: string) => void;
  setStep: (index: number, step: string) => void;
  useHint: () => boolean;
  setValidationState: (state: ValidationState) => void;
  resetProof: () => void;
  canUseHint: () => boolean;
};

const initialProofState = {
  currentProof: [] as string[],
  hintsUsed: 0,
  cooldownUntil: null as number | null,
  validationState: "idle" as ValidationState,
};

export const useProofStore = create<ProofState>()(
  persist(
    (set, get) => ({
      ...initialProofState,
      addStep: (step) =>
        set((state) => ({ currentProof: [...state.currentProof, step] })),
      setStep: (index, step) =>
        set((state) => {
          if (index < 0 || index >= state.currentProof.length) return state;

          const currentProof = [...state.currentProof];
          currentProof[index] = step;
          return { currentProof };
        }),
      useHint: () => {
        const { hintsUsed, cooldownUntil } = get();
        if (!checkHint(hintsUsed, cooldownUntil)) return false;

        const next = nextHintState(hintsUsed);
        set({
          hintsUsed: next.hintsUsed,
          cooldownUntil: next.cooldownUntil,
        });
        return true;
      },
      setValidationState: (validationState) => set({ validationState }),
      resetProof: () =>
        set({
          currentProof: [],
          hintsUsed: 0,
          cooldownUntil: null,
          validationState: "idle",
        }),
      canUseHint: () => {
        const { hintsUsed, cooldownUntil } = get();
        return checkHint(hintsUsed, cooldownUntil);
      },
    }),
    {
      name: "hyperlean-proof",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentProof: state.currentProof,
        hintsUsed: state.hintsUsed,
        cooldownUntil: state.cooldownUntil,
      }),
    }
  )
);
