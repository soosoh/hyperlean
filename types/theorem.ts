export type NodeStatus = "Locked" | "Available" | "Completed";

export type TheoremStat = {
  solveCount: number;
  avgTimeSeconds: number;
};

export type Theorem = {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: number;
  prerequisites: string[];
  axioms: string[];
  targetConclusion: string;
  solved?: boolean;
  firstProvedBy?: string;
  stats: TheoremStat;
};

export type TheoremNode = Theorem & { status: NodeStatus };
