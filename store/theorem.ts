"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theorem } from "@/types";
import { getAvailableNodes, getNodeStatus } from "@/lib/graph";

interface TheoremState {
  /**
   * Stored as an array so it survives JSON persistence. Use `solvedSet` to
   * derive a Set for graph computations.
   */
  solvedIds: string[];
  setSolved: (id: string) => void;
  unsetSolved: (id: string) => void;
  reset: () => void;
}

export const useTheoremStore = create<TheoremState>()(
  persist(
    (set) => ({
      solvedIds: [],
      setSolved: (id) =>
        set((state) =>
          state.solvedIds.includes(id)
            ? state
            : { solvedIds: [...state.solvedIds, id] },
        ),
      unsetSolved: (id) =>
        set((state) => ({
          solvedIds: state.solvedIds.filter((solved) => solved !== id),
        })),
      reset: () => set({ solvedIds: [] }),
    }),
    { name: "hyperlean-theorems" },
  ),
);

export function solvedSet(solvedIds: string[]): Set<string> {
  return new Set(solvedIds);
}

export function statusOf(theorem: Theorem, solvedIds: string[]) {
  return getNodeStatus(theorem, solvedSet(solvedIds));
}

export function availableOf(theorems: Theorem[], solvedIds: string[]) {
  return getAvailableNodes(theorems, solvedSet(solvedIds));
}
