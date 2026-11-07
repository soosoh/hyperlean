import type { NodeStatus, Theorem } from "@/types";

export interface DAG {
  /** prerequisite id -> list of theorem ids that depend on it */
  adjacency: Record<string, string[]>;
  /** deterministic topological ordering of theorem ids */
  topoOrder: string[];
}

/**
 * Builds a dependency DAG from theorem prerequisites using Kahn's algorithm.
 * Throws when the prerequisite graph contains a cycle.
 */
export function buildDAG(theorems: Theorem[]): DAG {
  const ids = new Set(theorems.map((t) => t.id));
  const adjacency: Record<string, string[]> = {};
  const indegree: Record<string, number> = {};

  for (const id of ids) {
    adjacency[id] = [];
    indegree[id] = 0;
  }

  for (const theorem of theorems) {
    for (const prerequisite of theorem.prerequisites) {
      if (!ids.has(prerequisite)) continue;
      adjacency[prerequisite].push(theorem.id);
      indegree[theorem.id] += 1;
    }
  }

  for (const id of Object.keys(adjacency)) {
    adjacency[id].sort();
  }

  const queue = [...ids].filter((id) => indegree[id] === 0).sort();
  const topoOrder: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift() as string;
    topoOrder.push(current);

    for (const next of adjacency[current]) {
      indegree[next] -= 1;
      if (indegree[next] === 0) {
        queue.push(next);
        queue.sort();
      }
    }
  }

  if (topoOrder.length !== ids.size) {
    throw new Error("Cycle detected in theorem prerequisite graph");
  }

  return { adjacency, topoOrder };
}

export function getNodeStatus(
  theorem: Theorem,
  solvedIds: Set<string>,
): NodeStatus {
  if (solvedIds.has(theorem.id)) return "Completed";
  const unlocked = theorem.prerequisites.every((id) => solvedIds.has(id));
  return unlocked ? "Available" : "Locked";
}

export function getAvailableNodes(
  theorems: Theorem[],
  solvedIds: Set<string>,
): Theorem[] {
  return theorems
    .filter((theorem) => getNodeStatus(theorem, solvedIds) === "Available")
    .sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Assigns each theorem a depth level = longest prerequisite chain leading to it.
 * Used by the graph renderer to lay nodes out in columns.
 */
export function computeLevels(theorems: Theorem[]): Map<string, number> {
  const byId = new Map(theorems.map((t) => [t.id, t]));
  const levels = new Map<string, number>();
  const visiting = new Set<string>();

  const resolve = (id: string): number => {
    const cached = levels.get(id);
    if (cached !== undefined) return cached;

    const theorem = byId.get(id);
    if (!theorem || theorem.prerequisites.length === 0) {
      levels.set(id, 0);
      return 0;
    }

    // Guard against cycles even though buildDAG would have thrown.
    if (visiting.has(id)) return 0;
    visiting.add(id);

    let level = 0;
    for (const prerequisite of theorem.prerequisites) {
      if (!byId.has(prerequisite)) continue;
      level = Math.max(level, resolve(prerequisite) + 1);
    }

    visiting.delete(id);
    levels.set(id, level);
    return level;
  };

  for (const theorem of theorems) resolve(theorem.id);
  return levels;
}
