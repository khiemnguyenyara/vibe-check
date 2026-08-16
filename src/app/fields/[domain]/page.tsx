"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { CareerCard } from "@/components/fields/career-card";
import { useFieldNavigation } from "@/components/home/use-field-navigation";
import { LevelPickerDialog } from "@/components/interview/level-picker-dialog";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { findDomain } from "@/lib/domains";
import { useLocale } from "@/lib/i18n/locale-context";
import { STAGGER } from "@/lib/motion/tokens";

interface FieldDomainRouteParams {
  domain: string;
}

/**
 * One career group's specialties — what a /fields carousel card opens into.
 * Shares `useFieldNavigation` with the carousel's parent and the home page
 * so locked/mastered/active states and the "enter an interview" flow stay
 * identical everywhere.
 */
export default function FieldDomainPage({
  params,
}: {
  params: Promise<FieldDomainRouteParams>;
}) {
  const { domain: domainId } = use(params);
  const { t } = useLocale();
  const {
    byField,
    lockNotice,
    handleEnter,
    pendingNode,
    handleConfirmLevel,
    closeLevelPicker,
  } = useFieldNavigation();

  const domainConfig = findDomain(domainId);
  const field = byField.find((entry) => entry.domain.id === domainId);

  if (!domainConfig || !field) {
    notFound();
  }

  const DomainIcon = domainConfig.icon;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="mx-auto w-full max-w-7xl flex-1 px-3 pb-24 pt-6 sm:px-4">
        <div className="mt-4 flex items-start gap-3">
          <span
            className={`grid size-12 shrink-0 place-items-center rounded-2xl text-white ${domainConfig.theme.badgeBg}`}
          >
            <DomainIcon className="size-6" aria-hidden />
          </span>
          <div>
            <h1 className="text-xl font-extrabold text-foreground">
              {domainConfig.sectionTitle}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {domainConfig.description}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {field.nodes.map((node, index) => (
            <CareerCard
              key={node.specialty.id}
              title={node.specialty.title}
              description={node.specialty.description}
              icon={node.specialty.icon}
              state={node.state}
              difficulty={node.specialty.difficulty}
              bestPercent={node.record?.bestPercent}
              lockedReason={node.lockedReason}
              delay={index * STAGGER.list}
              onActivate={() => handleEnter(node)}
            />
          ))}
        </div>

        {/* Locked-node explanation. A polite live region rather than a
            dialog: it answers a question the user just asked by tapping,
            and should not seize focus to do it. */}
        <p
          aria-live="polite"
          className="mt-6 text-center text-xs font-medium text-muted-foreground"
        >
          {lockNotice}
        </p>
      </main>

      <LevelPickerDialog
        open={pendingNode !== null}
        specialtyLabel={pendingNode?.specialty.title ?? ""}
        onOpenChange={(open) => {
          if (!open) closeLevelPicker();
        }}
        onConfirm={handleConfirmLevel}
      />
    </div>
  );
}
