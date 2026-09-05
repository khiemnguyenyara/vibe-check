export const homeStyles = {
  root: "relative isolate flex h-screen flex-col overflow-hidden bg-background text-foreground",
  heroBackdrop:
    "pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-violet-300 via-fuchsia-100 to-transparent dark:from-violet-900/60 dark:via-fuchsia-950/30",
  heroOrbLeft:
    "absolute -left-40 -top-20 size-[28rem] rounded-full bg-interview-accent/40 blur-3xl",
  heroOrbRight:
    "absolute -right-40 top-16 size-[28rem] rounded-full bg-fuchsia-500/35 blur-3xl",
  heroOrbCenter:
    "absolute left-1/2 top-40 size-[24rem] -translate-x-1/2 rounded-full bg-violet-400/25 blur-3xl",
  main: "flex-1 mx-auto flex w-full max-w-5xl flex-col justify-center px-3 sm:px-4",
  heading: "mb-10 text-center",
  title: "font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl",
  subtitle: "mt-3 text-base text-muted-foreground sm:text-lg",
} as const;
