"use client";

import Link from "next/link";
import { Menu } from "@base-ui/react/menu";
import { ChevronDown, ChevronRight, Menu as HamburgerIcon } from "lucide-react";

import { domains } from "@/lib/domains";
import { domainCopy } from "@/lib/i18n/domain-copy";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

/** Shared with the Get Started dialog's role picker, so every dropdown in
 *  the app (nav or in-form) reads as the same component.
 *
 * The z-index belongs on the Positioner, not the Popup: Popup itself renders
 * `position: static` (Positioner is the element floating-ui actually
 * places), so a z-index on Popup is inert. Without one here, a Positioner
 * with the default `z-index: auto` loses to any `position: fixed` ancestor
 * that sets its own z-index — e.g. Dialog's content — even though it's
 * later in paint order. That's what made the role picker's submenu
 * unclickable inside the Get Started dialog until this was added. */
export const menuPositionerClass = "z-[70] outline-none";

export const menuPopupClass =
  "min-w-56 origin-[var(--transform-origin)] rounded-2xl border border-quest-surface-border bg-popover p-1.5 text-popover-foreground shadow-lg outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95";

export const menuItemClass =
  "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground outline-none transition-colors data-highlighted:bg-interview-accent/10 data-highlighted:text-interview-accent-text";

const positionerClass = menuPositionerClass;
const popupClass = menuPopupClass;
const itemClass = menuItemClass;

/**
 * Every career field, each cascading into its own specialties on hover —
 * shared between the desktop "Jobs" dropdown and the mobile menu's Jobs
 * group. The field itself is expand-only (not a link): a specialty picks a
 * concrete practice, but "Tech" alone isn't one, so giving it a dual
 * click-to-navigate/hover-to-expand role would make its click behavior
 * ambiguous once it's already open from a hover. A trailing "view all"
 * item inside each submenu is the unambiguous way to reach the full list.
 */
function DomainSubmenuItems() {
  const { t } = useLocale();
  return (
    <>
      {domains.map((domain) => {
        const Icon = domain.icon;
        return (
          <Menu.SubmenuRoot key={domain.id}>
            <Menu.SubmenuTrigger
              openOnHover
              className={cn(itemClass, "justify-between")}
            >
              <span className="flex items-center gap-2">
                <Icon className="size-4" aria-hidden />
                {domainCopy(t, domain).sectionTitle}
              </span>
              <ChevronRight className="size-3.5 text-muted-foreground" aria-hidden />
            </Menu.SubmenuTrigger>
            <Menu.Portal>
              <Menu.Positioner
                className={positionerClass}
                sideOffset={4}
                align="start"
              >
                <Menu.Popup className={cn(popupClass, "min-w-48")}>
                  {domain.specialties.map((specialty) => (
                    <Menu.Item
                      key={specialty.id}
                      className={itemClass}
                      render={
                        <Link
                          href={
                            // Coming-soon domains have no registered module,
                            // so /interview/[domain]/[specialty] would 404 —
                            // send those to the (also-disabled) fields page.
                            domain.comingSoon
                              ? `/fields/${domain.id}`
                              : `/interview/${domain.id}/${specialty.id}`
                          }
                        />
                      }
                    >
                      {specialty.title}
                    </Menu.Item>
                  ))}
                  <div
                    className="mx-1.5 my-1 h-px bg-quest-surface-border"
                    aria-hidden
                  />
                  <Menu.Item
                    className={cn(itemClass, "font-bold text-interview-accent-text")}
                    render={<Link href={`/fields/${domain.id}`} />}
                  >
                    {t.fields.viewSpecialties}
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.SubmenuRoot>
        );
      })}
      <div className="mx-1.5 my-1 h-px bg-quest-surface-border" aria-hidden />
      <Menu.Item
        className={cn(itemClass, "font-bold text-interview-accent-text")}
        render={<Link href="/fields" />}
      >
        {t.header.jobsViewAll}
      </Menu.Item>
    </>
  );
}

/** Desktop "Jobs" dropdown — every career field, one click from the header. */
export function JobsMenu() {
  const { t } = useLocale();
  return (
    <Menu.Root>
      <Menu.Trigger
        openOnHover
        delay={75}
        className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/5 data-popup-open:bg-foreground/5"
      >
        {t.header.jobsNav}
        <ChevronDown className="size-3.5" aria-hidden />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className={positionerClass} sideOffset={8}>
          <Menu.Popup className={popupClass}>
            <DomainSubmenuItems />
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

/** Mobile hamburger — Home / Jobs / About collapsed into one menu, since the
 *  full nav row doesn't fit next to the logo and Get Started button. */
export function MobileNavMenu() {
  const { t } = useLocale();
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={t.header.mobileMenuAria}
        className="grid size-9 shrink-0 place-items-center rounded-full text-foreground transition-colors hover:bg-foreground/5 data-popup-open:bg-foreground/5"
      >
        <HamburgerIcon className="size-5" aria-hidden />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className={positionerClass} sideOffset={8} align="end">
          <Menu.Popup className={popupClass}>
            <Menu.Item className={itemClass} render={<Link href="/" />}>
              {t.header.homeNav}
            </Menu.Item>
            <Menu.Group>
              <Menu.GroupLabel className="px-3 pt-2 pb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t.header.jobsNav}
              </Menu.GroupLabel>
              <DomainSubmenuItems />
            </Menu.Group>
            <div className="mx-1.5 my-1 h-px bg-quest-surface-border" aria-hidden />
            <Menu.Item className={itemClass} render={<Link href="/about" />}>
              {t.header.aboutNav}
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
