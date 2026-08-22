"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { DomainCard } from "@/components/fields/domain-card";
import {
  FieldsSidebar,
  type DomainStatusFilter,
} from "@/components/fields/fields-sidebar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { domains } from "@/lib/domains";
import { domainCopy } from "@/lib/i18n/domain-copy";
import { useLocale } from "@/lib/i18n/locale-context";
import { STAGGER } from "@/lib/motion/tokens";

/**
 * The career-group directory — a filterable grid, distinct from the home
 * page's stacked teaser list on purpose. Picking a card is real navigation
 * to /fields/[domain], which shows just that group's specialties.
 */
export default function FieldsPage() {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<DomainStatusFilter>("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return domains.filter((domain) => {
      if (status === "available" && domain.comingSoon) return false;
      if (status === "comingSoon" && !domain.comingSoon) return false;
      if (!needle) return true;
      const copy = domainCopy(t, domain);
      const haystack = `${copy.sectionTitle} ${copy.description}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, status, t]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-3 pb-10 pt-6">
        <div className="mt-6 grid gap-5 lg:grid-cols-10">
          <FieldsSidebar
            className="lg:col-span-3"
            query={query}
            onQueryChange={setQuery}
            status={status}
            onStatusChange={setStatus}
          />

          <div className="lg:col-span-7">
            {visible.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((domain, index) => (
                  <DomainCard
                    key={domain.id}
                    domain={domain}
                    delay={index * STAGGER.list}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-10 text-center text-sm text-muted-foreground">
                {t.fields.empty}
              </p>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
