export const specialtySelectorStyles = {
  root: "w-full",
  header: "max-w-2xl mx-auto mb-12 text-center px-4",
  title: "text-3xl sm:text-4xl font-bold mb-4 text-foreground",
  subtitle: "text-lg text-muted-foreground",
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto px-4",
  card: "relative group p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
  cardSelected:
    "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-lg shadow-primary/10",
  cardContent: "flex flex-col gap-3",
  cardIcon:
    "inline-flex w-12 h-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors",
  cardText: "text-left",
  cardTitle: "font-semibold text-foreground mb-1",
  cardDescription: "text-sm text-muted-foreground",
  comingSoon:
    "absolute top-3 right-3 inline-block px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full",
} as const;
