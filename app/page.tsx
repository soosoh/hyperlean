"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { SkillTree } from "@/components/graph/SkillTree";
import { theorems } from "@/data/theorems";
import { useTheoremStore } from "@/store/theorem";

export default function HomePage(): ReactElement {
  const solvedIds = useTheoremStore((state) => state.solvedIds);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-bg">
      <SkillTree
        theorems={theorems}
        solvedIds={solvedIds}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    </main>
  );
}
