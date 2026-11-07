export type RuleType = "ModusPonens" | "Substitution" | "Axiom";

export interface ProofStep {
  id: string;
  formula: string;
  rule: RuleType;
  justification: string;
  lineNumber: number;
  dependsOn: string[];
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  inferredConclusion?: string;
}
