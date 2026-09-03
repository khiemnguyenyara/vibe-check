import "server-only";

import { experienceLevelSchema, LIMITS } from "@/lib/api/interview-contract";

import { tokenize } from "../scorer";
import type {
  ContentBank,
  ContentLocale,
  LocalizedText,
  QuestionBankEntry,
} from "./types";

/**
 * Content rules the type system cannot express, checked once at module load.
 *
 * ## Why this exists at all
 *
 * `types.ts` closes everything TypeScript can reach: list lengths, the score
 * literal, the option index ceiling, the specialty id. Two classes of rule
 * remain out of reach, and both fail badly today.
 *
 * 1. **String length.** `LIMITS.maxKeyPointChars` is 300, but counting
 *    characters in a type needs recursive conditional types over string
 *    literals, and the recursion limit is nowhere near 300 — let alone across
 *    the thousands of authored strings here. An over-long key point therefore
 *    compiles, and then fails inside the route's `finalize()` as an INTERNAL
 *    500 — for one entry out of many, so it presents as a session failing
 *    seemingly at random, several frames from its cause.
 *
 * 2. **Scorer compatibility.** `tokenize()` drops tokens shorter than three
 *    characters, and `isCovered()` returns false when a key point yields no
 *    tokens at all. A key point of `"CI/CD"` or `"L1 vs L2"` is therefore
 *    *impossible to cover* — it is scored as a knowledge gap no matter what
 *    the candidate writes. Nothing about that is visible at the type level,
 *    at review, or in the response; the question simply grades wrong forever.
 *
 * ## Why load-time rather than a test or a build step
 *
 * There is no test runner and no CI in this repo, and `server-only` throws
 * under a plain `node` invocation, so a validation script would need both a
 * new dependency and `node --conditions=react-server`. A module-scope check
 * is closer in kind to a test than to a per-request guard: it runs once when
 * the content module is first evaluated, costs nothing per request, and
 * converts a random per-session 500 into a deterministic, located failure.
 *
 * Honest about the gap: with no CI, a breach can still land on the default
 * branch. It surfaces at dev-server boot or on the first request after a
 * deploy rather than before the merge. That is strictly better than the
 * status quo and strictly worse than a test would be.
 */

const LOCALES: readonly ContentLocale[] = ["vi", "en"];

/**
 * Read off `experienceLevelSchema` rather than restated as a literal array,
 * so a level added to the wire contract is walked here automatically. A
 * hand-copied list would silently keep validating only the old levels — the
 * exact failure mode this file exists to convert into a loud one.
 */
const LEVELS = experienceLevelSchema.options;

class ContentInvariantError extends Error {
  constructor(issues: readonly string[]) {
    super(
      `Question bank content is invalid:\n  - ${issues.join("\n  - ")}\n` +
        "Fix the entries above; these would otherwise fail wire validation " +
        "or grade incorrectly at runtime."
    );
    this.name = "ContentInvariantError";
  }
}

/**
 * One localized string pulled out of an entry, tagged with what kind of
 * field it came from. Flattening every field into this shape first — rather
 * than checking each field inline, nested inside its own `if`/`for` — is
 * what lets `runFieldChecks` below apply the length and tokenizability rules
 * once, generically, instead of once per field per rule. Adding a rule that
 * should apply to every field (or a field that should carry the existing
 * rules) becomes a one-line change to `FIELD_RULE` or `collectFieldChecks`
 * rather than a new nesting level.
 */
interface FieldCheck {
  readonly path: string;
  readonly text: string;
  readonly kind: "prompt" | "keyPoint" | "option";
}

/**
 * What each field kind is checked against. Options are capped by
 * `maxKeyPointChars`, not `maxPromptChars` — an easy thing to get wrong when
 * authoring long option text, so it's spelled out here rather than assumed.
 */
const FIELD_RULE: Record<
  FieldCheck["kind"],
  { readonly noun: string; readonly limit: number; readonly mustTokenize: boolean }
> = {
  prompt: { noun: "prompt", limit: LIMITS.maxPromptChars, mustTokenize: false },
  // The scorer rule. See the header note (2) — only key points are graded
  // by token coverage, so only they need to survive tokenize().
  keyPoint: { noun: "key point", limit: LIMITS.maxKeyPointChars, mustTokenize: true },
  option: { noun: "option", limit: LIMITS.maxKeyPointChars, mustTokenize: false },
};

function pushLocalized(
  checks: FieldCheck[],
  value: LocalizedText,
  path: string,
  kind: FieldCheck["kind"]
): void {
  for (const locale of LOCALES) {
    checks.push({ path: `${path}.${locale}`, text: value[locale], kind });
  }
}

function collectFieldChecks(
  entry: QuestionBankEntry,
  at: string
): readonly FieldCheck[] {
  const checks: FieldCheck[] = [];
  pushLocalized(checks, entry.question, `${at}.question`, "prompt");

  if (entry.type === "open") {
    entry.expectedKeyPoints.forEach((point, i) =>
      pushLocalized(checks, point, `${at}.expectedKeyPoints[${i}]`, "keyPoint")
    );
  } else {
    entry.options.forEach((option, i) =>
      pushLocalized(checks, option, `${at}.options[${i}]`, "option")
    );
  }

  return checks;
}

function runFieldChecks(checks: readonly FieldCheck[], issues: string[]): void {
  for (const { path, text, kind } of checks) {
    const rule = FIELD_RULE[kind];

    if (text.length > rule.limit) {
      issues.push(
        `${path}: ${rule.noun} is ${text.length} chars, over the ${rule.limit} limit`
      );
    }

    if (rule.mustTokenize && tokenize(text).length === 0) {
      issues.push(
        `${path}: yields no significant tokens (${JSON.stringify(text)}) — ` +
          "the scorer can never mark it covered, so it is a permanent " +
          "knowledge gap. Give it wording with at least one word of 3+ " +
          'characters, e.g. "Cache invalidation via TTL" rather than "TTL".'
      );
    }
  }
}

/**
 * Structural checks specific to multiple-choice entries — nothing here is a
 * per-field text rule, so it stays separate from `runFieldChecks` rather
 * than forcing an awkward shared shape onto both.
 */
function checkMultipleChoiceEntry(
  entry: Extract<QuestionBankEntry, { type: "multiple_choice" }>,
  at: string,
  issues: string[]
): void {
  if (entry.correctOptionIndex >= entry.options.length) {
    issues.push(
      `${at}.correctOptionIndex: ${entry.correctOptionIndex} is out of range ` +
        `for ${entry.options.length} options`
    );
  }

  for (const locale of LOCALES) {
    // One pass with a Set rather than the O(n²) `rendered.indexOf` scan this
    // replaced — bounded by LIMITS.maxOptions (≤6) so it never mattered at
    // today's sizes, but costs nothing to keep linear as banks grow.
    const seen = new Set<string>();
    for (const option of entry.options) {
      const text = option[locale];
      if (seen.has(text)) {
        issues.push(
          `${at}.options.${locale}: duplicate option ${JSON.stringify(text)} — ` +
            "grading is an exact string match, so a duplicate makes the " +
            "correct answer ambiguous"
        );
        // One report per locale, same as the scan it replaced: further
        // duplicates in the same entry are the same authoring mistake.
        break;
      }
      seen.add(text);
    }
  }
}

function checkBank(bank: ContentBank, issues: string[]): void {
  for (const level of LEVELS) {
    for (const [index, entry] of bank.questions[level].entries()) {
      const at = `${bank.id}.${level}[${index}]`;

      runFieldChecks(collectFieldChecks(entry, at), issues);

      if (entry.type === "multiple_choice") {
        checkMultipleChoiceEntry(entry, at, issues);
      }
    }
  }
}

/**
 * Throws if any registered bank would produce content the wire rejects or the
 * scorer mishandles.
 *
 * Deliberately not checked: `rubric.criteria`, `difficulty_analysis.reasoning`,
 * and `label`. None of them cross the wire, so none of them have a limit to
 * breach — checking them would invent a rule rather than enforce one.
 *
 * Session-length coverage is checked by the caller, which knows the registry
 * and the session length; this function only sees one bank at a time.
 */
export function assertBanksValid(
  banks: readonly ContentBank[],
  sessionLength: number
): void {
  const issues: string[] = [];

  for (const bank of banks) {
    checkBank(bank, issues);

    for (const level of LEVELS) {
      const count = bank.questions[level].length;
      if (count < sessionLength) {
        issues.push(
          `${bank.id}.${level}: ${count} entries for a ${sessionLength}-question ` +
            "session — questions will repeat within one session"
        );
      }
    }
  }

  if (issues.length > 0) throw new ContentInvariantError(issues);
}
