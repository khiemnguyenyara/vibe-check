"use client";

import { use } from "react";
import { notFound } from "next/navigation";

import { FieldView } from "@/components/fields/field-view";
import { useFieldNavigation } from "@/components/home/use-field-navigation";
import { findDomain } from "@/lib/domains";

interface FieldDomainRouteParams {
  domain: string;
}

/**
 * One career group's specialties — what a /fields carousel card opens into.
 * Shares `useFieldNavigation` with the carousel's parent and the home page
 * so locked/mastered/active states and the "enter an interview" flow stay
 * identical everywhere. Rendering itself is delegated entirely to
 * `FieldView` (specs/003 §7c) — every domain gets the same header/hero/
 * mentor/carousel/footer shell, with per-domain color (and, where
 * configured, a mentor) coming from `@/components/fields/field-hero`.
 */
export default function FieldDomainPage({
  params,
}: {
  params: Promise<FieldDomainRouteParams>;
}) {
  const { domain: domainId } = use(params);
  const navigation = useFieldNavigation();
  const { byField } = navigation;

  const domainConfig = findDomain(domainId);
  const field = byField.find((entry) => entry.domain.id === domainId);

  if (!domainConfig || !field) {
    notFound();
  }

  return (
    <FieldView
      domainConfig={domainConfig}
      nodes={field.nodes}
      navigation={navigation}
    />
  );
}
