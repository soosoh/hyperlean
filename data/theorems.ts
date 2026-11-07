import type { Theorem } from "@/types";

export const theorems: Theorem[] = [
  {
    id: "modus-ponens",
    title: "Modus Ponens",
    category: "Propositional Logic",
    description:
      "From an implication A → B and its antecedent A, conclude B. The cornerstone inference rule.",
    difficulty: 1,
    prerequisites: [],
    axioms: ["ax-identity"],
    targetConclusion: "B",
    firstProvedBy: "Chrysippus",
    stats: { solveCount: 12840, avgTimeSeconds: 95 },
  },
  {
    id: "conjunction-elim",
    title: "Conjunction Elimination",
    category: "Propositional Logic",
    description:
      "A conjunction A ∧ B lets you extract either conjunct. Start from the whole and reach a part.",
    difficulty: 1,
    prerequisites: [],
    axioms: ["ax-and-elim-left", "ax-and-elim-right"],
    targetConclusion: "A",
    stats: { solveCount: 9640, avgTimeSeconds: 110 },
  },
  {
    id: "identity",
    title: "Law of Identity",
    category: "Propositional Logic",
    description:
      "Everything implies itself: A → A. The simplest tautology and a natural first proof.",
    difficulty: 1,
    prerequisites: [],
    axioms: ["ax-identity"],
    targetConclusion: "A → A",
    firstProvedBy: "Aristotle",
    stats: { solveCount: 15320, avgTimeSeconds: 70 },
  },
  {
    id: "hypothetical-syllogism",
    title: "Hypothetical Syllogism",
    category: "Propositional Logic",
    description:
      "Chain implications: from A → B and B → C derive A → C. Implication is transitive.",
    difficulty: 2,
    prerequisites: ["modus-ponens"],
    axioms: ["ax-hyp-syllogism"],
    targetConclusion: "A → C",
    stats: { solveCount: 6120, avgTimeSeconds: 210 },
  },
  {
    id: "double-negation",
    title: "Double Negation",
    category: "Propositional Logic",
    description:
      "Two negations cancel: from ¬¬A derive A. A gentle introduction to classical reasoning.",
    difficulty: 2,
    prerequisites: ["identity"],
    axioms: ["ax-double-negation"],
    targetConclusion: "A",
    stats: { solveCount: 5410, avgTimeSeconds: 180 },
  },
  {
    id: "contraposition",
    title: "Contraposition",
    category: "Propositional Logic",
    description:
      "Every implication is equivalent to its contrapositive: from A → B derive ¬B → ¬A.",
    difficulty: 3,
    prerequisites: ["hypothetical-syllogism"],
    axioms: ["ax-contraposition"],
    targetConclusion: "¬B → ¬A",
    stats: { solveCount: 3120, avgTimeSeconds: 320 },
  },
  {
    id: "de-morgan-and",
    title: "De Morgan's Law (Conjunction)",
    category: "Propositional Logic",
    description:
      "The negation of a conjunction becomes a disjunction of negations: ¬(A ∧ B) → (¬A ∨ ¬B).",
    difficulty: 3,
    prerequisites: ["conjunction-elim"],
    axioms: ["ax-de-morgan-and"],
    targetConclusion: "¬A ∨ ¬B",
    firstProvedBy: "Augustus De Morgan",
    stats: { solveCount: 2870, avgTimeSeconds: 340 },
  },
  {
    id: "de-morgan-or",
    title: "De Morgan's Law (Disjunction)",
    category: "Propositional Logic",
    description:
      "The negation of a disjunction becomes a conjunction of negations: ¬(A ∨ B) → (¬A ∧ ¬B).",
    difficulty: 4,
    prerequisites: ["de-morgan-and"],
    axioms: ["ax-de-morgan-or"],
    targetConclusion: "¬A ∧ ¬B",
    stats: { solveCount: 1980, avgTimeSeconds: 420 },
  },
  {
    id: "excluded-middle",
    title: "Law of Excluded Middle",
    category: "Propositional Logic",
    description:
      "Every proposition is either true or false: A ∨ ¬A. A classical tautology.",
    difficulty: 3,
    prerequisites: ["double-negation"],
    axioms: ["ax-excluded-middle"],
    targetConclusion: "A ∨ ¬A",
    firstProvedBy: "Aristotle",
    stats: { solveCount: 2260, avgTimeSeconds: 300 },
  },
  {
    id: "noncontradiction",
    title: "Law of Non-Contradiction",
    category: "Propositional Logic",
    description:
      "No proposition is both true and false: ¬(A ∧ ¬A). The bedrock of classical logic.",
    difficulty: 4,
    prerequisites: ["de-morgan-and", "double-negation"],
    axioms: ["ax-noncontradiction"],
    targetConclusion: "¬(A ∧ ¬A)",
    firstProvedBy: "Aristotle",
    stats: { solveCount: 1640, avgTimeSeconds: 480 },
  },
];

/**
 * Convenience starting context for the proof editor, keyed by theorem id.
 * These are the premises a solver may assume before deriving the conclusion.
 */
export const theoremPremises: Record<string, string[]> = {
  "modus-ponens": ["A → B", "A"],
  "conjunction-elim": ["A ∧ B"],
  identity: [],
  "hypothetical-syllogism": ["A → B", "B → C"],
  "double-negation": ["¬¬A"],
  contraposition: ["A → B"],
  "de-morgan-and": ["¬(A ∧ B)"],
  "de-morgan-or": ["¬(A ∨ B)"],
  "excluded-middle": [],
  noncontradiction: [],
};
