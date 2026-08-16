"use client";

import { Search } from "lucide-react";

import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

export type DomainStatusFilter = "all" | "available" | "comingSoon";

/** Left-rail filter panel for the /fields directory — search plus availability. */
export function FieldsSidebar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  className,
}: {
  readonly query: string;
  readonly onQueryChange: (value: string) => void;
  readonly status: DomainStatusFilter;
  readonly onStatusChange: (value: DomainStatusFilter) => void;
  readonly className?: string;
}) {
  const { t } = useLocale();

  const statusOptions: { value: DomainStatusFilter; label: string }[] = [
    { value: "all", label: t.fields.filterStatusAll },
    { value: "available", label: t.fields.filterStatusAvailable },
    { value: "comingSoon", label: t.home.field.comingSoon },
  ];

  return (
    <aside
      className={cn(
        "h-fit space-y-4 rounded-2xl border border-quest-surface-border bg-quest-surface p-4 lg:sticky lg:top-20",
        className
      )}
    >
      <h2 className="text-sm font-bold text-foreground">{t.fields.filterTitle}</h2>

      <label className="relative block">
        <Search
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={t.fields.filterSearchPlaceholder}
          aria-label={t.fields.filterSearchAria}
          className="w-full rounded-full border border-quest-surface-border bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-interview-accent"
        />
      </label>

      <div className="space-y-1">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onStatusChange(option.value)}
            aria-pressed={status === option.value}
            className={cn(
              "w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors",
              status === option.value
                ? "bg-interview-accent text-interview-accent-foreground"
                : "text-foreground hover:bg-quest-surface-border/40"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
