import type { DomainConfig } from "@/lib/domains";

import type { Dictionary } from "./dictionaries";

/**
 * `DomainConfig.sectionTitle`/`.description` in `@/lib/domains` are
 * Vietnamese-only literals — fine for the data that's the same in both
 * locales (`id`, icon, specialties' internal shape), not fine for display
 * copy. `t.fields.domains[id]` carries the localized version; this falls
 * back to the Vietnamese literal only for a domain that hasn't been added
 * to the locale files yet, so a new domain never renders blank.
 */
export function domainCopy(t: Dictionary, domain: DomainConfig) {
  const entries = t.fields.domains as Record<
    string,
    { sectionTitle: string; description: string }
  >;
  return entries[domain.id] ?? {
    sectionTitle: domain.sectionTitle,
    description: domain.description,
  };
}
