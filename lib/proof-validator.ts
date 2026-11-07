import type { Axiom, ProofStep, ValidationResult } from "@/types";

type BinOp = "and" | "or" | "implies" | "iff";

export type Formula =
  | { kind: "var"; name: string }
  | { kind: "const"; value: boolean }
  | { kind: "not"; inner: Formula }
  | { kind: "bin"; op: BinOp; left: Formula; right: Formula };

type TokenType =
  | "atom"
  | "not"
  | "and"
  | "or"
  | "implies"
  | "iff"
  | "lparen"
  | "rparen"
  | "true"
  | "false";

interface Token {
  type: TokenType;
  value?: string;
}

const BIN_SYMBOL: Record<BinOp, string> = {
  and: "∧",
  or: "∨",
  implies: "→",
  iff: "↔",
};

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const s = input;
  let i = 0;

  while (i < s.length) {
    const ch = s[i];

    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }

    const rest = s.slice(i);

    if (rest.startsWith("<->") || rest.startsWith("<=>")) {
      tokens.push({ type: "iff" });
      i += 3;
      continue;
    }
    if (ch === "↔") {
      tokens.push({ type: "iff" });
      i += 1;
      continue;
    }
    if (rest.startsWith("->") || rest.startsWith("=>")) {
      tokens.push({ type: "implies" });
      i += 2;
      continue;
    }
    if (ch === "→") {
      tokens.push({ type: "implies" });
      i += 1;
      continue;
    }
    if (rest.startsWith("/\\") || rest.startsWith("&&")) {
      tokens.push({ type: "and" });
      i += 2;
      continue;
    }
    if (ch === "∧" || ch === "&") {
      tokens.push({ type: "and" });
      i += 1;
      continue;
    }
    if (rest.startsWith("\\/") || rest.startsWith("||")) {
      tokens.push({ type: "or" });
      i += 2;
      continue;
    }
    if (ch === "∨" || ch === "|") {
      tokens.push({ type: "or" });
      i += 1;
      continue;
    }
    if (ch === "¬" || ch === "~" || ch === "!") {
      tokens.push({ type: "not" });
      i += 1;
      continue;
    }
    if (ch === "(") {
      tokens.push({ type: "lparen" });
      i += 1;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "rparen" });
      i += 1;
      continue;
    }
    if (ch === "⊤") {
      tokens.push({ type: "true" });
      i += 1;
      continue;
    }
    if (ch === "⊥") {
      tokens.push({ type: "false" });
      i += 1;
      continue;
    }
    if (/[A-Za-z]/.test(ch)) {
      let j = i + 1;
      while (j < s.length && /[A-Za-z0-9_]/.test(s[j])) j += 1;
      tokens.push({ type: "atom", value: s.slice(i, j) });
      i = j;
      continue;
    }

    throw new Error(`Unexpected character '${ch}'`);
  }

  return tokens;
}

export function parseFormula(input: string): Formula {
  const tokens = tokenize(input.trim());
  let pos = 0;

  const peek = (): Token | undefined => tokens[pos];
  const next = (): Token | undefined => tokens[pos++];

  const parseIff = (): Formula => {
    let left = parseImplies();
    while (peek()?.type === "iff") {
      next();
      const right = parseImplies();
      left = { kind: "bin", op: "iff", left, right };
    }
    return left;
  };

  const parseImplies = (): Formula => {
    const left = parseOr();
    if (peek()?.type === "implies") {
      next();
      const right = parseImplies();
      return { kind: "bin", op: "implies", left, right };
    }
    return left;
  };

  const parseOr = (): Formula => {
    let left = parseAnd();
    while (peek()?.type === "or") {
      next();
      const right = parseAnd();
      left = { kind: "bin", op: "or", left, right };
    }
    return left;
  };

  const parseAnd = (): Formula => {
    let left = parseNot();
    while (peek()?.type === "and") {
      next();
      const right = parseNot();
      left = { kind: "bin", op: "and", left, right };
    }
    return left;
  };

  const parseNot = (): Formula => {
    if (peek()?.type === "not") {
      next();
      return { kind: "not", inner: parseNot() };
    }
    return parseAtom();
  };

  const parseAtom = (): Formula => {
    const token = peek();
    if (!token) throw new Error("Unexpected end of formula");

    if (token.type === "atom") {
      next();
      const name = token.value as string;
      if (name.toLowerCase() === "true") return { kind: "const", value: true };
      if (name.toLowerCase() === "false") return { kind: "const", value: false };
      return { kind: "var", name };
    }
    if (token.type === "true") {
      next();
      return { kind: "const", value: true };
    }
    if (token.type === "false") {
      next();
      return { kind: "const", value: false };
    }
    if (token.type === "lparen") {
      next();
      const inner = parseIff();
      const closing = next();
      if (!closing || closing.type !== "rparen") {
        throw new Error("Expected ')'");
      }
      return inner;
    }

    throw new Error("Unexpected token in formula");
  };

  const formula = parseIff();
  if (pos !== tokens.length) {
    throw new Error("Unexpected trailing tokens in formula");
  }
  return formula;
}

export function formulaToString(formula: Formula): string {
  switch (formula.kind) {
    case "var":
      return formula.name;
    case "const":
      return formula.value ? "⊤" : "⊥";
    case "not":
      return `¬${formulaToString(formula.inner)}`;
    case "bin":
      return `(${formulaToString(formula.left)} ${BIN_SYMBOL[formula.op]} ${formulaToString(
        formula.right,
      )})`;
  }
}

function structuralEqual(a: Formula, b: Formula): boolean {
  return formulaToString(a) === formulaToString(b);
}

export function formulasEqual(a: string, b: string): boolean {
  try {
    return structuralEqual(parseFormula(a), parseFormula(b));
  } catch {
    return a.trim() === b.trim();
  }
}

/**
 * Attempts to bind every variable in `pattern` so the result equals `target`.
 * Shared variables must map to structurally identical formulae.
 */
function matchSubstitution(
  pattern: Formula,
  target: Formula,
  bindings: Map<string, Formula>,
): boolean {
  switch (pattern.kind) {
    case "var": {
      const existing = bindings.get(pattern.name);
      if (existing) return structuralEqual(existing, target);
      bindings.set(pattern.name, target);
      return true;
    }
    case "const":
      return target.kind === "const" && target.value === pattern.value;
    case "not":
      return target.kind === "not" && matchSubstitution(pattern.inner, target.inner, bindings);
    case "bin":
      return (
        target.kind === "bin" &&
        pattern.op === target.op &&
        matchSubstitution(pattern.left, target.left, bindings) &&
        matchSubstitution(pattern.right, target.right, bindings)
      );
  }
}

function checkModusPonens(step: Formula, context: Formula[]): ValidationResult {
  for (const candidate of context) {
    if (candidate.kind !== "bin" || candidate.op !== "implies") continue;
    if (!structuralEqual(candidate.right, step)) continue;

    const antecedentPresent = context.some((other) =>
      structuralEqual(other, candidate.left),
    );
    if (antecedentPresent) {
      return { valid: true, inferredConclusion: formulaToString(step) };
    }
  }

  return {
    valid: false,
    reason:
      "Modus Ponens needs an implication A → B and its antecedent A in the context to derive B.",
  };
}

function checkSubstitution(step: Formula, context: Formula[]): ValidationResult {
  for (const candidate of context) {
    const bindings = new Map<string, Formula>();
    if (!matchSubstitution(candidate, step, bindings)) continue;

    const nonIdentity = [...bindings.entries()].some(
      ([name, value]) => !(value.kind === "var" && value.name === name),
    );
    if (nonIdentity) {
      return { valid: true, inferredConclusion: formulaToString(step) };
    }
  }

  return {
    valid: false,
    reason:
      "No context formula yields this step by a uniform, non-identity substitution.",
  };
}

function checkAxiom(
  step: Formula,
  justification: string,
  axioms: Axiom[],
): ValidationResult {
  const named = axioms.filter(
    (axiom) => axiom.id === justification || axiom.name === justification,
  );
  const pool = named.length > 0 ? named : axioms;

  for (const axiom of pool) {
    let schema: Formula;
    try {
      schema = parseFormula(axiom.schema);
    } catch {
      continue;
    }
    const bindings = new Map<string, Formula>();
    if (matchSubstitution(schema, step, bindings)) {
      return {
        valid: true,
        inferredConclusion: formulaToString(step),
      };
    }
  }

  return {
    valid: false,
    reason: justification
      ? `Step does not match the schema of axiom '${justification}'.`
      : "Step does not match any known axiom schema.",
  };
}

function parseContext(context: string[]): Formula[] {
  const parsed: Formula[] = [];
  for (const raw of context) {
    try {
      parsed.push(parseFormula(raw));
    } catch {
      // Ignore context lines that are not well-formed.
    }
  }
  return parsed;
}

/**
 * Deterministic, client-side proof step validation. Supports Modus Ponens,
 * uniform substitution, and axiom application. Identical inputs always yield
 * identical results.
 */
export function validateStep(
  step: ProofStep,
  context: string[],
  axioms: Axiom[],
): ValidationResult {
  let stepFormula: Formula;
  try {
    stepFormula = parseFormula(step.formula);
  } catch (error) {
    return {
      valid: false,
      reason: `Invalid formula: ${(error as Error).message}`,
    };
  }

  if (step.formula.trim().length === 0) {
    return { valid: false, reason: "Empty formula." };
  }

  const parsedContext = parseContext(context);

  switch (step.rule) {
    case "ModusPonens":
      return checkModusPonens(stepFormula, parsedContext);
    case "Substitution":
      return checkSubstitution(stepFormula, parsedContext);
    case "Axiom":
      return checkAxiom(stepFormula, step.justification, axioms);
    default:
      return { valid: false, reason: "Unknown inference rule." };
  }
}
