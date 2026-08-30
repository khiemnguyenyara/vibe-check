import { Flame, Gauge, Sprout, type LucideIcon } from "lucide-react";

import type { ExperienceLevel } from "@/modules/types";

export type InterviewLevel = "easy" | "medium" | "difficult";

export interface LevelOption {
  readonly level: InterviewLevel;
  readonly label: string;
  readonly blurb: string;
  readonly icon: LucideIcon;
}

export const INTERVIEW_LEVELS: readonly LevelOption[] = [
  {
    level: "easy",
    label: "Dễ",
    blurb: "Câu hỏi cơ bản, phù hợp người mới bắt đầu.",
    icon: Sprout,
  },
  {
    level: "medium",
    label: "Trung bình",
    blurb: "Câu hỏi ở mức trung cấp, cần nắm chắc kiến thức nền.",
    icon: Gauge,
  },
  {
    level: "difficult",
    label: "Khó",
    blurb: "Câu hỏi chuyên sâu, thử thách cao.",
    icon: Flame,
  },
];

export function toExperienceLevel(level: InterviewLevel): ExperienceLevel {
  switch (level) {
    case "easy":
      return "junior";
    case "medium":
      return "mid";
    case "difficult":
      return "senior";
  }
}

/**
 * Inverse mapping, used only when resuming a stored session. "staff" has no
 * UI-facing level (the picker never offers it), so it falls back to "medium".
 */
export function toInterviewLevel(level: ExperienceLevel): InterviewLevel {
  switch (level) {
    case "junior":
      return "easy";
    case "mid":
      return "medium";
    case "senior":
      return "difficult";
    case "staff":
      return "medium";
  }
}

/** Validates the `?level=` query param the level-picker dialog navigates with. */
export function parseInterviewLevel(value: string | null): InterviewLevel | null {
  return value === "easy" || value === "medium" || value === "difficult"
    ? value
    : null;
}

/** The one route every level-confirm flow navigates to. */
export function interviewPath(
  domainId: string,
  specialtyId: string,
  level: InterviewLevel
): string {
  return `/interview/${domainId}/${specialtyId}?level=${level}`;
}
