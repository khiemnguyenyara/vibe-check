"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "@base-ui/react/menu";
import { ChevronDown, ChevronRight } from "lucide-react";

import {
  menuItemClass,
  menuPopupClass,
  menuPositionerClass,
} from "@/components/layout/nav-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { domains } from "@/lib/domains";
import { useLocale } from "@/lib/i18n/locale-context";
import type { IntakeReason } from "@/lib/session/intake";
import { saveIntakeProfile } from "@/lib/session/intake";
import { cn } from "@/lib/utils";

const REASONS: readonly IntakeReason[] = ["interview", "other"];

const OTHER_ROLE = "other";

const fieldClass =
  "rounded-xl border border-quest-surface-border bg-quest-surface px-3 py-2 text-sm font-normal text-foreground outline-none transition-colors hover:border-interview-accent/40 focus-visible:ring-2 focus-visible:ring-interview-accent";

/**
 * The role picker — same Jobs-dropdown UX as the header: hover a field
 * (Tech, Marketing, …) to cascade into its specialties, pick one to fill
 * the trigger. "Other" sits outside the cascade since it isn't a field.
 */
function RoleMenu({
  value,
  onSelect,
}: {
  readonly value: string;
  readonly onSelect: (role: string) => void;
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
        <Menu.Positioner className={menuPositionerClass} sideOffset={6} align="start">
          <Menu.Popup className={cn(menuPopupClass, "min-w-64")}>
            {domains.map((domain) => {
              const Icon = domain.icon;
              return (
                <Menu.SubmenuRoot key={domain.id}>
                  <Menu.SubmenuTrigger
                    openOnHover
                    className={cn(menuItemClass, "justify-between")}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="size-4" aria-hidden />
                      {domain.sectionTitle}
                    </span>
                    <ChevronRight className="size-3.5 text-muted-foreground" aria-hidden />
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
                    <Menu.Positioner
                      className={menuPositionerClass}
                      sideOffset={4}
                      align="start"
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
            })}
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
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { t } = useLocale();
  const [roleSelection, setRoleSelection] = useState("");
  const [roleOther, setRoleOther] = useState("");
  const [reason, setReason] = useState<IntakeReason | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!reason) return;
    const role = roleSelection === OTHER_ROLE ? roleOther.trim() : roleSelection;
    saveIntakeProfile({ role, reason });
    onOpenChange(false);
    router.push("/fields");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* Accessible name only — the redesign dropped the visible intro
            copy, but the dialog still needs a title for screen readers. */}
        <DialogTitle className="sr-only">{t.getStarted.title}</DialogTitle>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
            {t.getStarted.roleLabel}
            <RoleMenu value={roleSelection} onSelect={setRoleSelection} />
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

          <button
            type="submit"
            disabled={!reason}
            className="mt-1 w-full rounded-full bg-interview-accent px-4 py-2.5 text-sm font-bold text-interview-accent-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t.getStarted.submit}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
