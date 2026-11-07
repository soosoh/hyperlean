import type { ReactElement } from "react";

type EdgeProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export function Edge({ x1, y1, x2, y2 }: EdgeProps): ReactElement {
  return (
    <path
      d={`M${x1},${y1} L${x2},${y2}`}
      stroke="#475569"
      strokeWidth={2}
      fill="none"
      pointerEvents="none"
      className="transition-colors duration-200"
    />
  );
}
