"use client";

interface EdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active?: boolean;
}

export function Edge({ x1, y1, x2, y2, active = false }: EdgeProps) {
  const midX = (x1 + x2) / 2;

  return (
    <path
      d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
      fill="none"
      stroke={active ? "#3b82f6" : "#334155"}
      strokeWidth={active ? 2.5 : 1.8}
      opacity={active ? 0.95 : 0.8}
    />
  );
}
