export type AxiomType = "propositional" | "first-order";

export interface Axiom {
  id: string;
  name: string;
  type: AxiomType;
  schema: string;
  description: string;
}
