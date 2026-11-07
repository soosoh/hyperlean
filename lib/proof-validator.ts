import type { Axiom, ProofStep, ValidationResult } from "@/types";

/**
 * Propositional formula AST.
 *
 * This is intentionally minimal: it covers the connectives needed for
 * Modus Ponens, uniform substitution and axiom-schema matching. The parser
 * is pure and deterministic (no Date / Math.random / IO).
 */
export type Formula =
  | { readonly kind: "atom"; readonly name: string }
  | { readonly kind: "not"; readonly body: Formula }
  | { readonly kind: "and"; readonly left: Formula; readonly right: Formula }
  | { readonly kind: "or"; readonly left: Formula; readonly right: Formula }
  | { readonly kind: "implies"; readonly left: Formula; readonly right: Formula }
  | { readonly kind: "iff"; readonly left: Formula; readonly right: Formula };

type TokenKind =
  | "atom"
  | "not"
  | "and"
  | "or"
  | "implies"
  | "iff"
  | "lparen"
  | "rparen"
  | "eof";

interface Token {
  kind: TokenKind;
  value: string;
  pos: number;
}

class FormulaSyntaxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FormulaSyntaxError";
  }
}

const MULTI_CHAR_TOKENS: ReadonlyArray<{ text: string; kind: TokenKind }> = [
  { text: "<=>", kind: "iff" },
  { text: "<->", kind: "iff" },
  { text: "->", kind: "implies" },
  { text: "=>", kind: "implies" },
  { text: "/\\", kind: "and" },
  { text: "\\/", kind: "or" },
];

const SINGLE_CHAR_TOKENS: Readonly<Record<string, TokenKind>> = {
  "↔": "iff",
  "→": "implies",
  "∧": "and",
  "∨": "or",
  "¬": "not",
  "&": "and",
  "|": "or",
  "~": "not",
  "!": "not",
  "(": "lparen",
  ")": "rparen",
};

const IDENT_START = /[\p{L}_]/u;
const IDENT_PART = /[\p{L}\p{N}_']/u;
const WHITESPACE = /\s/u;

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (WHITESPACE.test(ch)) {
      i += 1;
      continue;
    }

    let matchedMulti = false;
    for (const token of MULTI_CHAR_TOKENS) {
      if (input.startsWith(token.text, i)) {
        tokens.push({ kind: token.kind, value: token.text, pos: i });
        i += token.text.length;
        matchedMulti = true;
        break;
      }
    }
    if (matchedMulti) continue;

    const single = SINGLE_CHAR_TOKENS[ch];
    if (single) {
      tokens.push({ kind: single, value: ch, pos: i });
      i += 1;
      continue;
    }

    if (IDENT_START.test(ch)) {
      let end = i + 1;
      while (end < input.length && IDENT_PART.test(input[end])) {
        end += 1;
      }
      tokens.push({ kind: "atom", value: input.slice(i, end), pos: i });
      i = end;
      continue;
    }

    throw new FormulaSyntaxError(`Unexpected character "${ch}" at position ${i}`);
  }

  tokens.push({ kind: "eof", value: "", pos: input.length });
  return tokens;
}

class Parser {
  private index = 0;
  private readonly tokens: Token[];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): Formula {
    const formula = this.parseIff();
    if (this.peek().kind !== "eof") {
      throw new FormulaSyntaxError(
        `Unexpected token "${this.peek().value}" at position ${this.peek().pos}`,
      );
    }
    return formula;
  }

  private peek(): Token {
    return this.tokens[this.index];
  }

  private next(): Token {
    const token = this.tokens[this.index];
    this.index += 1;
    return token;
  }

  private match(kind: TokenKind): boolean {
    if (this.peek().kind === kind) {
      this.index += 1;
      return true;
    }
    return false;
  }

  private expect(kind: TokenKind): Token {
    const token = this.peek();
    if (token.kind !== kind) {
      throw new FormulaSyntaxError(
        `Expected ${kind} but found "${token.value}" at position ${token.pos}`,
      );
    }
    return this.next();
  }

  // iff: lowest precedence, left-associative
  private parseIff(): Formula {
    let left = this.parseImplies();
    while (this.match("iff")) {
      const right = this.parseImplies();
      left = { kind: "iff", left, right };
    }
    return left;
  }

  // implication: right-associative
  private parseImplies(): Formula {
    const left = this.parseOr();
    if (this.match("implies")) {
      const right = this.parseImplies();
      return { kind: "implies", left, right };
    }
    return left;
  }

  private parseOr(): Formula {
    let left = this.parseAnd();
    while (this.match("or")) {
      const right = this.parseAnd();
      left = { kind: "or", left, right };
    }
    return left;
  }

  private parseAnd(): Formula {
    let left = this.parseUnary();
    while (this.match("and")) {
      const right = this.parseUnary();
      left = { kind: "and", left, right };
    }
    return left;
  }

  private parseUnary(): Formula {
    if (this.match("not")) {
      const body = this.parseUnary();
      return { kind: "not", body };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): Formula {
    if (this.match("lparen")) {
      const formula = this.parseIff();
      this.expect("rparen");
      return formula;
    }

    const token = this.peek();
    if (token.kind === "atom") {
      this.index += 1;
      return { kind: "atom", name: token.value };
    }

    throw new FormulaSyntaxError(
      `Expected a formula but found "${token.value}" at position ${token.pos}`,
    );
  }
}

/** Parse a propositional formula string into an AST. Throws on invalid input. */
export function parseFormula(input: string): Formula {
  return new Parser(tokenize(input)).parse();
}

/** Render a formula back to a canonical, fully parenthesised string. */
export function formatFormula(formula: Formula): string {
  switch (formula.kind) {
    case "atom":
      return formula.name;
    case "not": {
      const body = formatFormula(formula.body);
      return formula.body.kind === "atom" ? `¬${body}` : `¬(${body})`;
    }
    case "and":
      return `(${formatFormula(formula.left)} ∧ ${formatFormula(formula.right)})`;
    case "or":
      return `(${formatFormula(formula.left)} ∨ ${formatFormula(formula.right)})`;
    case "implies":
      return `(${formatFormula(formula.left)} → ${formatFormula(formula.right)})`;
    case "iff":
      return `(${formatFormula(formula.left)} ↔ ${formatFormula(formula.right)})`;
  }
}

function formulaEquals(a: Formula, b: Formula): boolean {
  switch (a.kind) {
    case "atom":
      return b.kind === "atom" && a.name === b.name;
    case "not":
      return b.kind === "not" && formulaEquals(a.body, b.body);
    case "and":
      return (
        b.kind === "and" &&
        formulaEquals(a.left, b.left) &&
        formulaEquals(a.right, b.right)
      );
    case "or":
      return (
        b.kind === "or" &&
        formulaEquals(a.left, b.left) &&
        formulaEquals(a.right, b.right)
      );
    case "implies":
      return (
        b.kind === "implies" &&
        formulaEquals(a.left, b.left) &&
        formulaEquals(a.right, b.right)
      );
    case "iff":
      return (
        b.kind === "iff" &&
        formulaEquals(a.left, b.left) &&
        formulaEquals(a.right, b.right)
      );
  }
}

/**
 * Match a pattern against a target where every atom in the pattern is a
 * metavariable. Bindings must be uniform: the same metavariable can only be
 * bound to one subformula. Deterministic (single left-to-right pass).
 */
function unify(
  pattern: Formula,
  target: Formula,
  bindings: Map<string, Formula>,
): boolean {
  if (pattern.kind === "atom") {
    const existing = bindings.get(pattern.name);
    if (existing) {
      return formulaEquals(existing, target);
    }
    bindings.set(pattern.name, target);
    return true;
  }

  switch (pattern.kind) {
    case "not":
      return target.kind === "not" && unify(pattern.body, target.body, bindings);
    case "and":
      return (
        target.kind === "and" &&
        unify(pattern.left, target.left, bindings) &&
        unify(pattern.right, target.right, bindings)
      );
    case "or":
      return (
        target.kind === "or" &&
        unify(pattern.left, target.left, bindings) &&
        unify(pattern.right, target.right, bindings)
      );
    case "implies":
      return (
        target.kind === "implies" &&
        unify(pattern.left, target.left, bindings) &&
        unify(pattern.right, target.right, bindings)
      );
    case "iff":
      return (
        target.kind === "iff" &&
        unify(pattern.left, target.left, bindings) &&
        unify(pattern.right, target.right, bindings)
      );
  }
}

function tryParse(input: string): Formula | null {
  try {
    return parseFormula(input);
  } catch {
    return null;
  }
}

function validateModusPonens(
  target: Formula,
  context: readonly string[],
): ValidationResult {
  const parsed = context
    .map(tryParse)
    .filter((formula): formula is Formula => formula !== null);

  for (let i = 0; i < parsed.length; i += 1) {
    const candidate = parsed[i];
    if (candidate.kind !== "implies") continue;
    if (!formulaEquals(candidate.right, target)) continue;

    for (let j = 0; j < parsed.length; j += 1) {
      if (j === i) continue;
      if (formulaEquals(parsed[j], candidate.left)) {
        return { valid: true, inferredConclusion: formatFormula(target) };
      }
    }
  }

  return {
    valid: false,
    reason:
      "No implication in context has an antecedent present and a consequent matching this step.",
  };
}

function validateSubstitution(
  target: Formula,
  context: readonly string[],
): ValidationResult {
  for (const source of context) {
    const parsed = tryParse(source);
    if (parsed === null) continue;

    const bindings = new Map<string, Formula>();
    if (unify(parsed, target, bindings)) {
      return { valid: true, inferredConclusion: formatFormula(target) };
    }
  }

  return {
    valid: false,
    reason:
      "No context formula can be transformed into this step by uniform substitution.",
  };
}

function validateAxiom(
  target: Formula,
  axioms: readonly Axiom[],
): ValidationResult {
  for (const axiom of axioms) {
    const schema = tryParse(axiom.schema);
    if (schema === null) continue;

    const bindings = new Map<string, Formula>();
    if (unify(schema, target, bindings)) {
      return { valid: true, inferredConclusion: formatFormula(target) };
    }
  }

  return {
    valid: false,
    reason: "This step is not an instance of any available axiom schema.",
  };
}

/**
 * Validate a single proof step against the formulas proven so far (`context`)
 * and the available axioms. Pure and deterministic: identical inputs always
 * produce identical output.
 */
export function validateStep(
  step: ProofStep,
  context: readonly string[],
  axioms: readonly Axiom[],
): ValidationResult {
  let target: Formula;
  try {
    target = parseFormula(step.formula);
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Unknown syntax error";
    return { valid: false, reason: `Invalid formula: ${detail}` };
  }

  switch (step.rule) {
    case "ModusPonens":
      return validateModusPonens(target, context);
    case "Substitution":
      return validateSubstitution(target, context);
    case "Axiom":
      return validateAxiom(target, axioms);
    default:
      return {
        valid: false,
        reason: `Unknown rule: ${String(step.rule)}`,
      };
  }
}
