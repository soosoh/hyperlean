import type { NodeStatus, Theorem } from "@/types";

export function buildDAG(theorems: Theorem[]): {
  adjacency: Record<string, string[]>;
  topoOrder: string[];
} {
  const adjacency: Record<string, string[]> = {};
  const theoremMap = new Map<string, Theorem>();

  for (const t of theorems) {
    adjacency[t.id] = [...t.prerequisites].sort();
    theoremMap.set(t.id, t);
  }

  const visited = new Set<string>();
  const visiting = new Set<string>();
  const order: string[] = [];

  const visit = (id: string): void => {
    if (visited.has(id)) return;
    if (visiting.has(id)) {
      throw new Error(`Cycle detected in theorem graph at node: ${id}`);
    }
    visiting.add(id);

    const deps = adjacency[id] ?? [];
    for (const dep of deps) {
      if (!theoremMap.has(dep)) {
        throw new Error(`Theorem ${id} references missing prerequisite: ${dep}`);
      }
      visit(dep);
    }

    visiting.delete(id);
    visited.add(id);
    order.push(id);
  };

  const ids = Array.from(theoremMap.keys()).sort();
  for (const id of ids) {
    visit(id);
  }

  return { adjacency, topoOrder: order };
}

export function getNodeStatus(
  theorem: Theorem,
  solvedIds: Set<string>
): NodeStatus {
  if (solvedIds.has(theorem.id)) return "Completed";

  for (const prereq of theorem.prerequisites) {
    if (!solvedIds.has(prereq)) return "Locked";
  }

  return "Available";
}

export function getAvailableNodes(
  theorems: Theorem[],
  solvedIds: Set<string>
): Theorem[] {
  return theorems
    .filter((t) => getNodeStatus(t, solvedIds) === "Available")
    .sort((a, b) => a.id.localeCompare(b.id));
}
