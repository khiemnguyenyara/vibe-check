"use client";

import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useLocale } from "@/lib/i18n/locale-context";

import { jobSpecialties } from "./job-specialties";
import {
  specialtyOptionVariants,
  specialtyPickerDialogStyles as styles,
} from "./specialty-picker-dialog.styles";

/**
 * "What's your job specialty?" — shown when the home launcher's "Start
 * interview now" card is picked, before any field/specialty page loads.
 * Only `development` (§7b, job-specialties.ts) has an `href` today; the rest
 * render disabled rather than being omitted, so the full category set is
 * visible even though only one is built.
 */
export function SpecialtyPickerDialog({
  open,
  onOpenChange,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { t } = useLocale();

  function handleSelect(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className={styles.title}>
          {t.home.specialtyPicker.title}
        </DialogTitle>
        <p className={styles.subtitle}>{t.home.specialtyPicker.subtitle}</p>

        <div className={styles.grid}>
          {jobSpecialties.map(({ id, label, icon: Icon, href }) => (
            <button
              key={id}
              type="button"
              disabled={!href}
              onClick={() => href && handleSelect(href)}
              className={specialtyOptionVariants({ disabled: !href })}
            >
              <Icon className={styles.optionIcon} aria-hidden />
              <span className={styles.optionLabel}>{label}</span>
              {!href && (
                <span className={styles.optionBadge}>
                  {t.home.field.comingSoon}
                </span>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
