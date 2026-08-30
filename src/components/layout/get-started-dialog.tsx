"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "@base-ui/react/menu";
import { ChevronDown, ChevronRight } from "lucide-react";

import { fieldAccent } from "@/components/home/field-accent";
import { interviewPath, type InterviewLevel } from "@/components/interview/level";
import { LevelPickerDialog } from "@/components/interview/level-picker-dialog";
import {
  menuItemClass,
  menuPopupClass,
  menuPositionerClass,
} from "@/components/layout/nav-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { DomainConfig, Specialty } from "@/lib/domains";
import { domains } from "@/lib/domains";
import { domainCopy } from "@/lib/i18n/domain-copy";
import { useLocale } from "@/lib/i18n/locale-context";
import type { IntakeReason } from "@/lib/session/intake";
import { saveIntakeProfile } from "@/lib/session/intake";
import { cn } from "@/lib/utils";

const REASONS: readonly IntakeReason[] = ["interview", "other"];

const OTHER_ROLE = "other";

const fieldClass =
  "rounded-xl border border-quest-surface-border bg-quest-surface px-3 py-2 text-sm font-normal text-foreground outline-none transition-colors hover:border-interview-accent/40 focus-visible:ring-2 focus-visible:ring-interview-accent";

/**
 * The role picker. With no `domainConfig`, this is the full Jobs-dropdown
 * cascade: hover a field (Tech, Marketing, …) to reach its specialties.
 * With one — opened from `SiteHeader` on a `FieldView` page (specs/003
 * §7c) — the field is already decided by which page you're on, so this
 * skips straight to a flat list of that field's specialties instead of
 * asking the visitor to re-pick the field they're already looking at.
 * "Other" sits outside either list since it isn't a field.
 */
function RoleMenu({
  value,
  onSelect,
  domainConfig,
}: {
  readonly value: string;
  readonly onSelect: (role: string) => void;
  readonly domainConfig?: DomainConfig;
}) {
  const { t } = useLocale();
  const label =
    value === "" ? t.getStarted.rolePlaceholder
    : value === OTHER_ROLE ? t.getStarted.roleOther
    : value;

  return (
    <Menu.Root>
      <Menu.Trigger
        className={cn(
          fieldClass,
          "flex w-full cursor-pointer items-center justify-between gap-2 text-left",
          value === "" && "text-muted-foreground"
        )}
      >
        {label}
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          className={menuPositionerClass}
          sideOffset={6}
          align="start"
          // Portaled — needs its own fieldAccent (see the doc comment there).
          style={domainConfig ? fieldAccent(domainConfig.id) : undefined}
        >
          <Menu.Popup className={cn(menuPopupClass, "min-w-64")}>
            {domainConfig ? (
              domainConfig.specialties.map((specialty) => (
                <Menu.Item
                  key={specialty.id}
                  className={menuItemClass}
                  onClick={() => onSelect(specialty.title)}
                >
                  {specialty.title}
                </Menu.Item>
              ))
            ) : (
              domains.map((domain) => {
                const Icon = domain.icon;
                // Both the trigger row and its flyout are portal-scoped
                // separately (see fieldAccent's doc comment), but they're
                // the same domain, so one call covers both.
                const accent = fieldAccent(domain.id);
                return (
                  <Menu.SubmenuRoot key={domain.id}>
                    <Menu.SubmenuTrigger
                      openOnHover
                      className={cn(menuItemClass, "justify-between")}
                      style={accent}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="size-4" aria-hidden />
                        {domainCopy(t, domain).sectionTitle}
                      </span>
                      <ChevronRight className="size-3.5 text-muted-foreground" aria-hidden />
                    </Menu.SubmenuTrigger>
                    <Menu.Portal>
                      <Menu.Positioner
                        className={menuPositionerClass}
                        sideOffset={4}
                        align="start"
                        style={accent}
                      >
                        <Menu.Popup className={cn(menuPopupClass, "min-w-48")}>
                          {domain.specialties.map((specialty) => (
                            <Menu.Item
                              key={specialty.id}
                              className={menuItemClass}
                              onClick={() => onSelect(specialty.title)}
                            >
                              {specialty.title}
                            </Menu.Item>
                          ))}
                        </Menu.Popup>
                      </Menu.Positioner>
                    </Menu.Portal>
                  </Menu.SubmenuRoot>
                );
              })
            )}
            <div className="mx-1.5 my-1 h-px bg-quest-surface-border" aria-hidden />
            <Menu.Item
              className={menuItemClass}
              onClick={() => onSelect(OTHER_ROLE)}
            >
              {t.getStarted.roleOther}
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

/**
 * Quick intake — job/career + why the visit — before routing into practice.
 * Answers are saved locally (see lib/session/intake.ts) for later
 * personalization; nothing here blocks navigation on a network call.
 */
export function GetStartedDialog({
  open,
  onOpenChange,
  domainConfig,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  /** Scopes the role picker to this field and tints the dialog with its
   *  accent color — passed by `SiteHeader` when opened from a `FieldView`
   *  page. Omit for the generic, any-field intake (home, about, /fields). */
  readonly domainConfig?: DomainConfig;
}) {
  const router = useRouter();
  const { t } = useLocale();
  const [roleSelection, setRoleSelection] = useState("");
  const [roleOther, setRoleOther] = useState("");
  const [reason, setReason] = useState<IntakeReason | null>(null);
  // Set only when the picked role is a real specialty of `domainConfig`
  // (not "Other" or free text) — holds the LevelPickerDialog open for the
  // difficulty step between submitting this form and routing into the
  // interview, same two-step motion as picking a card on the field page.
  const [pendingSpecialty, setPendingSpecialty] = useState<Specialty | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // On a field page the role picker is the whole point of this form (it's
    // what routes into the level picker below) — an empty pick there must
    // block submit the same way a missing reason blocks it on the generic
    // form, or this would silently skip straight to /fields/{domain}.
    if (domainConfig ? !roleSelection : !reason) return;

    const specialty = domainConfig?.specialties.find(
      (s) => s.title === roleSelection
    );
    const role = roleSelection === OTHER_ROLE ? roleOther.trim() : roleSelection;
    saveIntakeProfile({ role, reason: reason ?? undefined });

    if (specialty) {
      onOpenChange(false);
      setPendingSpecialty(specialty);
      return;
    }

    onOpenChange(false);
    router.push(domainConfig ? `/fields/${domainConfig.id}` : "/fields");
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-md"
          style={domainConfig ? fieldAccent(domainConfig.id) : undefined}
        >
          {/* Accessible name only — the redesign dropped the visible intro
              copy, but the dialog still needs a title for screen readers. */}
          <DialogTitle className="sr-only">{t.getStarted.title}</DialogTitle>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
              {t.getStarted.roleLabel}
              <RoleMenu
                value={roleSelection}
                onSelect={setRoleSelection}
                domainConfig={domainConfig}
              />
            </div>

            {roleSelection === OTHER_ROLE && (
              <input
                type="text"
                value={roleOther}
                onChange={(event) => setRoleOther(event.target.value)}
                placeholder={t.getStarted.roleOtherPlaceholder}
                autoFocus
                className={fieldClass}
              />
            )}

            {!domainConfig && (
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">
                  {t.getStarted.reasonLabel}
                </span>
                <div className="flex gap-2">
                  {REASONS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setReason(value)}
                      aria-pressed={reason === value}
                      className={cn(
                        "flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors",
                        reason === value
                          ? "border-interview-accent bg-interview-accent text-interview-accent-foreground"
                          : "border-quest-surface-border bg-quest-surface text-foreground hover:border-interview-accent/40 hover:bg-interview-accent/5"
                      )}
                    >
                      {value === "interview"
                        ? t.getStarted.reasonInterview
                        : t.getStarted.reasonOther}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={domainConfig ? !roleSelection : !reason}
              className="mt-1 w-full rounded-full bg-interview-accent px-4 py-2.5 text-sm font-bold text-interview-accent-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t.getStarted.submit}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {domainConfig && (
        <LevelPickerDialog
          open={pendingSpecialty !== null}
          domainId={domainConfig.id}
          specialtyLabel={pendingSpecialty?.label ?? ""}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) setPendingSpecialty(null);
          }}
          onConfirm={(level: InterviewLevel) => {
            if (!pendingSpecialty) return;
            router.push(interviewPath(domainConfig.id, pendingSpecialty.id, level));
            setPendingSpecialty(null);
          }}
        />
      )}
    </>
  );
}
