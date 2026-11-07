import type { ReactElement } from "react";
import type { Theorem, NodeStatus } from "@/types";

type NodeProps = {
  theorem: Theorem;
  status: NodeStatus;
  focused: boolean;
  onSelect: (id: string) => void;
};

const statusColors: Record<NodeStatus, string> = {
  Locked: "#64748B",
  Available: "#3B82F6",
  Completed: "#10B981",
};

export function Node({ theorem, status, focused, onSelect }: NodeProps): ReactElement {
  const color = statusColors[status];
  const r = 24;
  const label =
    theorem.id.length > 2 ? theorem.id.slice(0, 2).toUpperCase() : theorem.id.toUpperCase();

  return (
    <g
      role="button"
      tabIndex={focused ? 0 : -1}
      aria-label={`${theorem.title}, ${status}`}
      aria-pressed={status === "Completed"}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onSelect(theorem.id);
        }
      }}
      onClick={() => onSelect(theorem.id)}
      style={{ cursor: "pointer" }}
    >
      <circle
        cx={0}
        cy={0}
        r={r}
        fill={status === "Locked" ? "#0F172A" : color}
        stroke={color}
        strokeWidth={focused ? 4 : 2}
        className="transition-all duration-200"
      />
      <text
        x={0}
        y={4}
        fill="#FFFFFF"
        fontSize={12}
        fontWeight={600}
        textAnchor="middle"
        pointerEvents="none"
        className="select-none"
      >
        {label}
      </text>
      {focused && (
        <circle
          cx={0}
          cy={0}
          r={r + 6}
          fill="transparent"
          stroke={color}
          strokeWidth={2}
          className="transition-opacity duration-200"
        />
      )}
    </g>
  );
}
