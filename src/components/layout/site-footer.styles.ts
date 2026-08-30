export const siteFooterStyles = {
  footer: "relative isolate flex flex-1 flex-col justify-center overflow-hidden",
  backgroundImage: "-z-10 object-cover opacity-50",
  overlay: "absolute inset-0 -z-10 bg-gradient-to-b from-background/40 to-background/60",
  content:
    "mx-auto flex max-w-5xl flex-col items-center gap-3 px-3 pt-20 pb-6 text-center sm:px-4 sm:pt-24 sm:pb-8",
  // object-top rather than the default center — footerMark (dok.png) is a
  // tall standing character, and a center-crop at this square size cuts
  // off its face.
  logo: "size-10 rounded-xl object-cover object-top",
  tagline: "flex items-center gap-1.5 text-sm font-semibold text-foreground",
  taglineIcon: "size-4",
  description: "max-w-md text-xs leading-relaxed text-muted-foreground",
  copyright: "mt-2 text-xs text-muted-foreground",
} as const;
