import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Briefcase,
  ClipboardList,
  Code2,
  Film,
  Megaphone,
  Palette,
  PenLine,
} from "lucide-react";

export interface JobSpecialty {
  readonly id: string;
  /** Canonical English name — same convention as `DomainConfig.label` in `@/lib/domains`, not localized. */
  readonly label: string;
  readonly icon: LucideIcon;
  /**
   * Where picking this specialty sends the user. Absent means the specialty
   * isn't built yet — the option renders but stays disabled (§7b).
   */
  readonly href?: string;
}

/**
 * The "what's your job specialty?" picker shown from the home launcher.
 * Only `development` routes anywhere today — it reuses the existing `tech`
 * domain page rather than a new one, since that page already has its own
 * icon/color theme (indigo, `Code2`) per `@/lib/domains`.
 */
export const jobSpecialties: readonly JobSpecialty[] = [
  { id: "development", label: "Development", icon: Code2, href: "/fields/tech" },
  { id: "design", label: "Design", icon: Palette },
  { id: "writing", label: "Writing", icon: PenLine },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "ai-data", label: "Data Science", icon: Brain },
  { id: "video", label: "Video", icon: Film },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "admin", label: "Admin", icon: ClipboardList },
];
