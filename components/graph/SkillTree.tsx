"use client";

import { useCallback, useMemo, useState } from "react";
import type { KeyboardEvent, MouseEvent, ReactElement, WheelEvent } from "react";
import type { Theorem, TheoremNode } from "@/types";
import { buildDAG, getNodeStatus } from "@/lib/graph";
import { Node } from "./Node";
import { Edge } from "./Edge";

const sampleTheorems: Theorem[] = [
  {
    id: "axiom-1",
    title: "Law of Identity",
    category: "propositional",
    description: "A implies A",
    difficulty: 1,
    prerequisites: [],
    axioms: ["identity"],
    targetConclusion: "A → A",
    stats: { solveCount: 0, avgTimeSeconds: 0 },
  },
  {
    id: "modus-ponens",
    title: "Modus Ponens",
    category: "propositional",
    description: "From A → B and A, infer B",
    difficulty: 2,
    prerequisites: ["axiom-1"],
    axioms: ["implication-elimination"],
    targetConclusion: "B",
    stats: { solveCount: 0, avgTimeSeconds: 0 },
  },
  {
    id: "hypothetical-syllogism",
    title: "Hypothetical Syllogism",
    category: "propositional",
    description: "From A → B and B → C, infer A → C",
    difficulty: 3,
    prerequisites: ["modus-ponens"],
    axioms: ["implication-introduction"],
    targetConclusion: "A → C",
    stats: { solveCount: 0, avgTimeSeconds: 0 },
  },
  {
    id: "de-morgans",
    title: "De Morgan's Law",
    category: "propositional",
    description: "¬(A ∧ B) ≡ ¬A ∨ ¬B",
    difficulty: 3,
    prerequisites: ["modus-ponens"],
    axioms: ["negation"],
    targetConclusion: "¬(A ∧ B) → (¬A ∨ ¬B)",
    stats: { solveCount: 0, avgTimeSeconds: 0 },
  },
  {
    id: "contraposition",
    title: "Contraposition",
    category: "propositional",
    description: "A → B ≡ ¬B → ¬A",
    difficulty: 3,
    prerequisites: ["hypothetical-syllogism"],
    axioms: ["negation", "implication"],
    targetConclusion: "(A → B) → (¬B → ¬A)",
    stats: { solveCount: 0, avgTimeSeconds: 0 },
  },
  {
    id: "disjunction-intro",
    title: "Disjunction Introduction",
    category: "propositional",
    description: "From A, infer A ∨ B",
    difficulty: 2,
    prerequisites: ["axiom-1"],
    axioms: ["disjunction"],
    targetConclusion: "A → (A ∨ B)",
    stats: { solveCount: 0, avgTimeSeconds: 0 },
  },
];

type SkillTreeProps = {
  theorems?: Theorem[];
  solvedIds?: string[];
  onInspect?: (theoremId: string) => void;
};

export function SkillTree({
  theorems: providedTheorems = sampleTheorems,
  solvedIds: providedSolvedIds = [],
  onInspect,
}: SkillTreeProps): ReactElement {
  const solvedIds = useMemo(() => new Set(providedSolvedIds), [providedSolvedIds]);
  const [focusIndex, setFocusIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const { topoOrder } = useMemo(() => buildDAG(providedTheorems), [providedTheorems]);

  const nodes: TheoremNode[] = useMemo(
    () =>
      topoOrder.map((id) => {
        const theorem = providedTheorems.find((t) => t.id === id)!;
        return { ...theorem, status: getNodeStatus(theorem, solvedIds) };
      }),
    [providedTheorems, topoOrder, solvedIds]
  );

  const nodeCount = nodes.length;
  const nodeRadius = 24;
  const nodeSpacing = 140;

  const getNodePosition = (index: number): { x: number; y: number } => ({
    x: (index % 3) * nodeSpacing,
    y: Math.floor(index / 3) * nodeSpacing,
  });

  const inspect = useCallback(
    (id: string): void => {
      onInspect?.(id);
      console.log(`Inspecting theorem: ${id}`);
      const idx = nodes.findIndex((n) => n.id === id);
      if (idx !== -1) setFocusIndex(idx);
    },
    [nodes, onInspect]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>): void => {
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        setFocusIndex((i) => (i + 1) % nodeCount);
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        setFocusIndex((i) => (i - 1 + nodeCount) % nodeCount);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setFocusIndex((i) => (i + 1) % nodeCount);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setFocusIndex((i) => (i - 1 + nodeCount) % nodeCount);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const id = nodes[focusIndex]?.id;
        if (id) inspect(id);
      }
    },
    [focusIndex, nodeCount, nodes, inspect]
  );

  const handleWheel = useCallback((e: WheelEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => Math.min(Math.max(z * delta, 0.5), 2));
  }, []);

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>): void => {
      const start = { x: e.clientX, y: e.clientY };
      const startPan = { ...pan };

      const handleMouseMove = (ev: globalThis.MouseEvent): void => {
        setPan({
          x: startPan.x + (ev.clientX - start.x),
          y: startPan.y + (ev.clientY - start.y),
        });
      };

      const handleMouseUp = (): void => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [pan]
  );

  return (
    <div
      role="region"
      aria-label="Skill tree"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ backgroundColor: "#0A0F1D", minHeight: "100vh" }}
      className="outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
    >
      <div
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >
        <svg
          width="100%"
          height="100%"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            overflow: "visible",
          }}
        >
          {topoOrder.flatMap((id, i) => {
            const theorem = providedTheorems.find((t) => t.id === id)!;
            const [x1, y1] = [
              (i % 3) * nodeSpacing + nodeRadius,
              Math.floor(i / 3) * nodeSpacing + nodeRadius,
            ];
            return theorem.prerequisites.flatMap((prereq) => {
              const pIndex = topoOrder.indexOf(prereq);
              if (pIndex === -1) return [];
              const [x2, y2] = [
                (pIndex % 3) * nodeSpacing + nodeRadius,
                Math.floor(pIndex / 3) * nodeSpacing + nodeRadius,
              ];
              return <Edge key={`${prereq}-${id}`} x1={x2} y1={y2} x2={x1} y2={y1} />;
            });
          })}

          {nodes.map((node, i) => {
            const { x, y } = getNodePosition(i);
            return (
              <g key={node.id} transform={`translate(${x + 60}, ${y + 60})`}>
                <Node
                  theorem={node}
                  status={node.status}
                  focused={i === focusIndex}
                  onSelect={inspect}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
