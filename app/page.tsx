"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { SkillTree } from "@/components/graph/SkillTree";
import { ProofEditor } from "@/components/proof/ProofEditor";
import { theoremPremises, theorems } from "@/data/theorems";
import { useTheoremStore } from "@/store/theorem";

export default function HomePage() {
  const solvedIds = useTheoremStore((state) => state.solvedIds);
  const setSolved = useTheoremStore((state) => state.setSolved);
  const [selectedId, setSelectedId] = useState<string | null>("identity");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selected = useMemo(
    () => theorems.find((theorem) => theorem.id === selectedId) ?? null,
    [selectedId],
  );

  const solvedCount = solvedIds.length;
  const total = theorems.length;

  if (!mounted) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm text-slate-500">Loading Hyperlean…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <Sparkles size={14} /> Hyperlean
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-100">
            Prove theorems. Level up.
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            A keyboard-first theorem-proving gym. Pick a node, build a proof,
            validate it.
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-card/60 px-4 py-2 text-right">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Progress
          </p>
          <p className="text-lg font-semibold text-slate-100">
            {solvedCount} / {total}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SkillTree
          theorems={theorems}
          solvedIds={solvedIds}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <div>
          {selected ? (
            <ProofEditor
              key={selected.id}
              theorem={selected}
              initialPremises={theoremPremises[selected.id] ?? []}
              onSolved={setSolved}
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-800 p-8 text-sm text-slate-500">
              Select a theorem from the skill tree to begin.
            </div>
          )}
        </div>
      </div>

      <footer className="text-xs text-slate-600">
        Tip: focus the skill tree and press J / K to move, Enter to inspect,
        then Ctrl/Cmd + Enter to validate your proof.
      </footer>
    </main>
  );
}
