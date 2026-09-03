/**
 * The specialty id vocabulary, as literal types.
 *
 * ## Why this file imports nothing
 *
 * `src/lib/domains.ts` is the natural home for these strings and already holds
 * them — but it also imports two dozen lucide-react icons, so anything that
 * reads it drags a client icon set into its import graph. The server-only
 * content layer therefore could not name a specialty id at all, and
 * `ContentBank.id` was widened to `string` with a comment explaining the
 * compromise. The consequence was silent: a bank whose `id` did not match any
 * real specialty simply never got selected, because `resolveBank` falls back
 * to the general bank rather than complaining.
 *
 * Hoisting the literals into a module with zero imports resolves that without
 * undoing the icon boundary. Both `domains.ts` and the content layer sit
 * downstream of `src/lib`, and `docs/hla.md` §6 permits `modules → lib` while
 * forbidding the reverse — so this is the legal direction for both.
 *
 * Keep it free of imports. The moment this file needs one, it stops being
 * safe for the server-only content layer to read, and the compromise above
 * comes back.
 *
 * These tuples are the source of truth for the *type*; `domains.ts` remains
 * the source of truth for the display data (label, icon, difficulty, copy).
 * `domains.ts`'s `_TechSpecialtyIdsMatch` assertion proves the two agree in
 * both directions: `Specialty.id: SpecialtyId` alone only catches an id
 * written there that doesn't belong to any domain; `_TechSpecialtyIdsMatch`
 * is what also catches the reverse — an id sitting in `TECH_SPECIALTY_IDS`
 * that no card in `domains.ts` actually uses, which would otherwise resolve
 * a content bank while staying permanently unreachable from any real page.
 */

export const TECH_SPECIALTY_IDS = [
  "web-development",
  "mobile-development",
  "software-development",
  "ai-ml",
  "devops-cloud",
  "data",
  "qa-testing",
  "blockchain",
  "cybersecurity",
] as const;

export const MARKETING_SPECIALTY_IDS = ["seo", "ads", "content"] as const;

export const DESIGN_SPECIALTY_IDS = ["ui-ux", "graphic", "motion"] as const;

export const DATA_SPECIALTY_IDS = [
  "data-analyst",
  "data-engineer",
  "data-scientist",
  "bi",
] as const;

export const PRODUCT_SPECIALTY_IDS = [
  "product-manager",
  "product-owner",
] as const;

export type TechSpecialtyId = (typeof TECH_SPECIALTY_IDS)[number];
export type MarketingSpecialtyId = (typeof MARKETING_SPECIALTY_IDS)[number];
export type DesignSpecialtyId = (typeof DESIGN_SPECIALTY_IDS)[number];
export type DataSpecialtyId = (typeof DATA_SPECIALTY_IDS)[number];
export type ProductSpecialtyId = (typeof PRODUCT_SPECIALTY_IDS)[number];

/**
 * Every specialty id across every domain.
 *
 * Note that `"data"` appears as a tech specialty while the `data` *domain*
 * has its own `data-analyst`/`data-engineer`/... ids. That is not a clash —
 * a specialty id is only ever resolved within a domain, and the route carries
 * both (`/interview/[domain]/[specialty]`).
 */
export type SpecialtyId =
  | TechSpecialtyId
  | MarketingSpecialtyId
  | DesignSpecialtyId
  | DataSpecialtyId
  | ProductSpecialtyId;
