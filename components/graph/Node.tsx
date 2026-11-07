"use client";

import type { KeyboardEvent } from "react";
import type { NodeStatus, Theorem } from "@/types";

export const NODE_WIDTH = 190;
export const NODE_HEIGHT = 62;

const STATUS_STYLE: Record<
  NodeStatus,
  { stroke: string; label: string; dot: string }
> = {
  Locked: { stroke: "#475569", label: "#94a3b8", dot: "#64748b" },
  Available: { stroke: "#3b82f6", label: "#dbeafe", dot: "#3b82f6" },
  Completed: { stroke: "#10b981", label: "#d1fae5", dot: "#10b981" },
};

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

interface NodeProps {
  theorem: Theorem;
  status: NodeStatus;
  x: number;
  y: number;
  focused: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function Node({
  theorem,
  status,
  x,
  y,
  focused,
  selected,
  onSelect,
}: NodeProps) {
  const style = STATUS_STYLE[status];
  const showRing = focused || selected;

  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(theorem.id);
    }
  };

  return (
    <g
      transform={`translate(${x}, ${y})`}
      role="button"
      aria-label={`${theorem.title} (${status})`}
      aria-pressed={selected}
      tabIndex={-1}
      onClick={() => onSelect(theorem.id)}
      onKeyDown={handleKeyDown}
      className="cursor-pointer"
    >
      {showRing ? (
        <rect
          x={-7}
          y={-7}
          width={NODE_WIDTH + 14}
          height={NODE_HEIGHT + 14}
          rx={16}
          fill="none"
          stroke={style.stroke}
          strokeWidth={2}
          strokeDasharray={focused && !selected ? "6 4" : undefined}
          opacity={0.9}
        />
      ) : null}
      <rect
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        rx={12}
        fill="#1e293b"
        stroke={style.stroke}
        strokeWidth={selected ? 3 : 2}
      />
      <circle cx={18} cy={20} r={5} fill={style.dot} />
      <text x={32} y={25} fill={style.label} fontSize={13} fontWeight={600}>
        {truncate(theorem.title, 22)}
      </text>
      <text x={18} y={46} fill="#64748b" fontSize={11}>
        {status} · Lv {theorem.difficulty}
      </text>
    </g>
  );
}
