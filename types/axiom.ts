export type AxiomType = "propositional" | "first-order";

export interface Axiom {
  id: string;
  name: string;
  type: AxiomType;
  /** Formula schema using single-letter metavariables, e.g. "A → (B → A)". */
  schema: string;
  description: string;
}
