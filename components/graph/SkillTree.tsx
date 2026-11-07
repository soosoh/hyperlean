"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Maximize2, Minus, Plus } from "lucide-react";
import type { Theorem } from "@/types";
import { buildDAG, computeLevels, getNodeStatus } from "@/lib/graph";
import { Edge } from "./Edge";
import { NODE_HEIGHT, NODE_WIDTH, Node } from "./Node";

const COLUMN_GAP = 110;
const ROW_GAP = 48;
const PADDING = 60;
const MIN_SCALE = 0.5;
const MAX_SCALE = 1.8;

interface SkillTreeProps {
  theorems: Theorem[];
  solvedIds: string[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function clampScale(value: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, Number(value.toFixed(2))));
}

export function SkillTree({
  theorems,
  solvedIds,
  selectedId,
  onSelect,
}: SkillTreeProps) {
  const ordered = useMemo(() => {
    try {
      return buildDAG(theorems).topoOrder;
    } catch {
      return theorems.map((theorem) => theorem.id);
    }
  }, [theorems]);

  const positions = useMemo(() => {
    const levels = computeLevels(theorems);
    const byLevel = new Map<number, string[]>();

    for (const id of ordered) {
      const level = levels.get(id) ?? 0;
      const bucket = byLevel.get(level) ?? [];
      bucket.push(id);
      byLevel.set(level, bucket);
    }

    const result = new Map<string, { x: number; y: number }>();
    for (const [level, ids] of byLevel) {
      ids.forEach((id, index) => {
        result.set(id, {
          x: PADDING + level * (NODE_WIDTH + COLUMN_GAP),
          y: PADDING + index * (NODE_HEIGHT + ROW_GAP),
        });
      });
    }
    return result;
  }, [theorems, ordered]);

  const dimensions = useMemo(() => {
    let maxX = 0;
    let maxY = 0;
    for (const position of positions.values()) {
      maxX = Math.max(maxX, position.x + NODE_WIDTH);
      maxY = Math.max(maxY, position.y + NODE_HEIGHT);
    }
    return {
      width: maxX + PADDING,
      height: Math.max(maxY + PADDING, 420),
    };
  }, [positions]);

  const solved = useMemo(() => new Set(solvedIds), [solvedIds]);

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [focusedId, setFocusedId] = useState<string | null>(ordered[0] ?? null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null,
  );

  const moveFocus = useCallback(
    (direction: 1 | -1) => {
      if (ordered.length === 0) return;
      const current = focusedId ? ordered.indexOf(focusedId) : -1;
      const nextIndex = Math.min(
        Math.max(current + direction, 0),
        ordered.length - 1,
      );
      setFocusedId(ordered[nextIndex]);
    },
    [focusedId, ordered],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;
    if (key === "j" || key === "J" || key === "ArrowDown" || key === "ArrowRight") {
      event.preventDefault();
      moveFocus(1);
      return;
    }
    if (key === "k" || key === "K" || key === "ArrowUp" || key === "ArrowLeft") {
      event.preventDefault();
      moveFocus(-1);
      return;
    }
    if (key === "Enter" && focusedId) {
      event.preventDefault();
      onSelect(focusedId);
      return;
    }
    if (key === "+" || key === "=") {
      setScale((value) => clampScale(value + 0.1));
      return;
    }
    if (key === "-" || key === "_") {
      setScale((value) => clampScale(value - 0.1));
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-card/60">
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 px-4 py-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">Skill Tree</h2>
          <p className="text-xs text-slate-500">
            J / K or arrows to move · Enter to inspect · + / − to zoom
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setScale((value) => clampScale(value - 0.1))}
            aria-label="Zoom out"
            className="rounded-md border border-slate-700 p-1.5 text-slate-300 hover:bg-slate-800"
          >
            <Minus size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              setScale(1);
              setOffset({ x: 0, y: 0 });
            }}
            aria-label="Reset view"
            className="rounded-md border border-slate-700 p-1.5 text-slate-300 hover:bg-slate-800"
          >
            <Maximize2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => setScale((value) => clampScale(value + 0.1))}
            aria-label="Zoom in"
            className="rounded-md border border-slate-700 p-1.5 text-slate-300 hover:bg-slate-800"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div
        role="application"
        aria-label="Theorem skill tree"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onWheel={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest("button")) return;
          setScale((value) => clampScale(value - event.deltaY * 0.001));
        }}
        onPointerDown={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest("button") || target.closest("g[role='button']")) {
            return;
          }
          drag.current = {
            x: event.clientX,
            y: event.clientY,
            ox: offset.x,
            oy: offset.y,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          setOffset({
            x: drag.current.ox + (event.clientX - drag.current.x),
            y: drag.current.oy + (event.clientY - drag.current.y),
          });
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerLeave={() => {
          drag.current = null;
        }}
        className="h-[520px] w-full cursor-grab touch-none overflow-hidden rounded-b-2xl bg-bg outline-none focus-visible:ring-2 focus-visible:ring-primary active:cursor-grabbing"
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          role="img"
          aria-label="Skill tree nodes and prerequisite edges"
        >
          <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
            {theorems.map((theorem) => {
              const to = positions.get(theorem.id);
              if (!to) return null;
              return theorem.prerequisites.map((prerequisiteId) => {
                const from = positions.get(prerequisiteId);
                if (!from) return null;
                return (
                  <Edge
                    key={`${prerequisiteId}->${theorem.id}`}
                    x1={from.x + NODE_WIDTH}
                    y1={from.y + NODE_HEIGHT / 2}
                    x2={to.x}
                    y2={to.y + NODE_HEIGHT / 2}
                    active={solved.has(prerequisiteId)}
                  />
                );
              });
            })}
            {theorems.map((theorem) => {
              const position = positions.get(theorem.id);
              if (!position) return null;
              return (
                <Node
                  key={theorem.id}
                  theorem={theorem}
                  status={getNodeStatus(theorem, solved)}
                  x={position.x}
                  y={position.y}
                  focused={focusedId === theorem.id}
                  selected={selectedId === theorem.id}
                  onSelect={(id) => {
                    setFocusedId(id);
                    onSelect(id);
                  }}
                />
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
