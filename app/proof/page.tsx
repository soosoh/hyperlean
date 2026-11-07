import type { ReactElement } from "react";
import type { Axiom } from "@/types";
import { ProofEditor } from "@/components/proof/ProofEditor";

const demoAxioms: Axiom[] = [
  {
    id: "identity",
    name: "Law of Identity",
    type: "propositional",
    schema: "A → A",
    description: "Every proposition implies itself.",
  },
  {
    id: "implication-elimination",
    name: "Implication Elimination",
    type: "propositional",
    schema: "(A ∧ (A → B)) → B",
    description: "Modus ponens expressed as a single schema.",
  },
  {
    id: "excluded-middle",
    name: "Law of Excluded Middle",
    type: "propositional",
    schema: "A ∨ ¬A",
    description: "A proposition is either true or its negation is.",
  },
];

export default function ProofPage(): ReactElement {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0A0F1D",
        padding: "32px 16px",
      }}
    >
      <ProofEditor
        theoremTitle="Modus Ponens"
        targetConclusion="B"
        axioms={demoAxioms}
      />
    </main>
  );
}
