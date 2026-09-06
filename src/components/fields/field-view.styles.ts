export const fieldViewStyles = {
  root: "flex min-h-screen flex-col text-foreground",
  // Fixed fullscreen backdrop covering entire viewport including behind header.
  // Hero backdrop (per-domain, `field-hero.ts`) is `absolute inset-0` against
  // this element. Content is centered vertically within the full screen height.
  heroWrap: "fixed inset-0 isolate overflow-hidden flex flex-col justify-center",
  // Same max-width + gutter as `SiteHeader`'s outer container, so the
  // carousel's edges line up with the header instead of the narrower
  // reading-width column a text-only page would use.
  main: "mx-auto flex w-full max-w-7xl flex-col px-3 pt-16 pb-6 sm:px-4 sm:pb-16 relative z-10",
  heading: "text-center",
  title: "font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl",
  subtitle: "mt-3 text-base text-muted-foreground sm:text-lg",
  carouselSection: "mt-20",
  lockNotice: "text-center text-xs font-medium text-muted-foreground",
  lockNoticeSpacing: "mt-6",
} as const;
