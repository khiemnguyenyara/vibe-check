import "server-only";

import { cybersecurityBank } from "./cybersecurity";
import { dataBank } from "./data";
import { devopsCloudBank } from "./devops-cloud";
import { generalBank } from "./general";
import { assertBanksValid } from "./invariants";
import { mobileDevelopmentBank } from "./mobile-development";
import { qaTestingBank } from "./qa-testing";
import { softwareDevelopmentBank } from "./software-development";
import type { ContentBank, NonEmpty, QuestionBankEntry } from "./types";
import { getOwn } from "@/lib/record";
import type { TechSpecialtyId } from "@/lib/specialty-ids";
import type { ExperienceLevel } from "../../../types";
import { webDevelopmentBank } from "./web-development";

export type {
  ContentBank,
  ContentLocale,
  DifficultyLevel,
  KeyPointList,
  LevelBank,
  LocalizedText,
  MaxScore,
  NonEmpty,
  OptionIndex,
  OptionList,
  QuestionBankEntry,
  SpecialtyBank,
} from "./types";

/**
 * The Tech content repository.
 *
 * This is the module-bound data layer: the only place that knows which
 * authored content exists and how a requested specialty maps onto it. It
 * holds no state, performs no I/O, and its lookups are pure functions of
 * their arguments — the same requirements `docs/interface-contracts.md` §6
 * puts on the scorer, for the same reason (a stateless route handler cannot
 * carry a cache between requests, so anything stateful here would be a bug
 * that only shows up under concurrency).
 *
 * ## Adding a specialty
 *
 * One file in this directory exporting a `ContentBank`, and one line in
 * `SPECIALTY_BANKS` below. Nothing else in Core, in the route handler, or in
 * the question service changes — the same "add a domain = add a registry
 * line" property `docs/hla.md` §5 gives the module registry, applied one
 * level down.
 */

/** How many questions one Tech session contains. Authoritative per specs/002 §10 Q1. */
export const TECH_SESSION_LENGTH = 5;

/**
 * The bank every unregistered specialty resolves to.
 *
 * Exported because the question service needs to name it when decoding an id
 * that was minted through the fallback path.
 */
export const FALLBACK_BANK_ID = generalBank.id;

/**
 * Specialty id → authored bank.
 *
 * Keys are `TechSpecialtyId`, so a misspelled one is now a compile error
 * rather than dead content. `Partial` because most specialties legitimately
 * have no bank yet and fall back to `generalBank`; that fallback still runs a
 * complete session, which is why a missing entry degrades rather than fails.
 *
 * Each key is spelled by the bank's own `id`, and each bank is typed
 * `SpecialtyBank`, so the key and the id cannot disagree.
 */
const SPECIALTY_BANKS: Readonly<
  Partial<Record<TechSpecialtyId, ContentBank>>
> = {
  [webDevelopmentBank.id]: webDevelopmentBank,
  [softwareDevelopmentBank.id]: softwareDevelopmentBank,
  [qaTestingBank.id]: qaTestingBank,
  [devopsCloudBank.id]: devopsCloudBank,
  [dataBank.id]: dataBank,
  [cybersecurityBank.id]: cybersecurityBank,
  [mobileDevelopmentBank.id]: mobileDevelopmentBank,
};

/**
 * Every bank the repository can resolve, keyed by bank id.
 *
 * The fallback is included because a question id minted through it decodes
 * back to `general`, and `resolveBankById` has to find it. Built from the
 * same objects as `SPECIALTY_BANKS` rather than duplicating the list, so the
 * two cannot fall out of sync.
 */
const BANKS_BY_ID: Readonly<Record<string, ContentBank>> = {
  ...SPECIALTY_BANKS,
  [generalBank.id]: generalBank,
};

/**
 * The bank that answers for `specialtyId`.
 *
 * Never returns null: an unknown, absent, or misspelled specialty resolves to
 * the general bank. Callers that need to know whether a fallback happened
 * should compare `result.id` against the specialty they asked for.
 *
 * `getOwn` rather than a bare index read: `specialtyId` originates in a
 * request body, which specs/002 §5.1 classifies as untrusted, and a plain
 * lookup would resolve `"constructor"` to a function.
 */
export function resolveBank(specialtyId: string | undefined): ContentBank {
  if (!specialtyId) return generalBank;
  return getOwn(SPECIALTY_BANKS, specialtyId) ?? generalBank;
}

/**
 * The bank a previously-minted question id refers to.
 *
 * Distinct from `resolveBank` on purpose. Selection maps a *specialty* to a
 * bank and is allowed to fall back; re-resolution maps a *bank id* recorded
 * inside an id and must not. Falling back here would let a question id from
 * a deleted bank silently grade against different content, which is exactly
 * the substitution specs/002 §5.2 exists to prevent — so this returns null
 * and the route answers INVALID_REQUEST instead.
 */
export function resolveBankById(bankId: string): ContentBank | null {
  return getOwn(BANKS_BY_ID, bankId) ?? null;
}

/**
 * The authored questions for one bank at one level.
 *
 * Non-empty by type (see `NonEmpty` in ./types.ts), so callers can index and
 * take `.length` without a guard.
 */
export function entriesFor(
  bank: ContentBank,
  level: ExperienceLevel
): NonEmpty<QuestionBankEntry> {
  return bank.questions[level];
}

/* ------------------------------------------------------------------ */
/* Load-time invariants                                                */
/* ------------------------------------------------------------------ */

/**
 * Runs once, when this module is first evaluated.
 *
 * Deliberately at module scope rather than per request. Everything it checks
 * is a property of the authored content, which cannot change between
 * requests, so checking it repeatedly would only add latency. See
 * ./invariants.ts for what it covers and why the type system cannot.
 *
 * A failure here takes down the interview route rather than serving content
 * that would 500 inside the route's own response validation or grade
 * incorrectly forever. That is the intended trade: a loud, located failure at
 * boot beats a quiet, misattributed one in production.
 */
assertBanksValid(Object.values(BANKS_BY_ID), TECH_SESSION_LENGTH);
