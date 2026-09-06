export const mentorCharacterStyles = {
  root: "w-full h-screen flex items-center justify-center",
  container: "w-full h-full relative flex items-center justify-center",
  card: "relative flex flex-col items-center justify-center gap-8 p-8 sm:p-12 max-h-screen overflow-y-auto",
  characterImage: "flex shrink-0 items-center justify-center max-w-md w-full h-auto",
  image: "w-full h-full object-contain",
  content:
    "flex flex-col items-center justify-center gap-6 text-center max-w-2xl flex-shrink-0",
  mentorName: "text-3xl sm:text-4xl font-bold text-foreground",
  mentorTitle: "text-lg sm:text-xl font-semibold text-primary",
  mentorDescription: "text-sm sm:text-base text-muted-foreground max-w-sm",
  ctaButton:
    "mt-6 px-8 py-4 rounded-lg font-semibold text-black transition-all hover:shadow-lg inline-flex items-center gap-2",
  lockedState:
    "w-full h-full flex flex-col items-center justify-center gap-4 text-muted-foreground",
  lockIcon: "text-6xl",
  lockedText: "text-lg font-medium",
} as const;
