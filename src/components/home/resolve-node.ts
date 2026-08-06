import type { DomainConfig, Specialty } from "@/lib/domains";
import { progressKey } from "@/lib/session/progress";

import type { GuestState, ResolvedNode } from "./types";

/**
 * Assign a state to one specialty.
 *
 * `active` means "the specialty you are currently practising" — the one you
 * last sat a session for. It is not "the next step in a sequence", because
 * there is no sequence: Frontend and Backend are different jobs, not
 * consecutive levels of one.
 */
export function resolveNode(
  domain: DomainConfig,
  specialty: Specialty,
  guest: GuestState,
  atGuestLimit: boolean
): ResolvedNode {
  const record = guest.progress.get(progressKey(domain.id, specialty.id));

  if (domain.comingSoon) {
    return {
      domain,
      specialty,
      state: "locked",
      lockedReason: "Nội dung đang được hoàn thiện.",
    };
  }

  if (atGuestLimit) {
    return {
      domain,
      specialty,
      state: "locked",
      record,
      lockedReason: "Đã dùng hết lượt miễn phí.",
    };
  }

  const isCurrent =
    guest.track?.moduleId === domain.id &&
    guest.track?.specialtyId === specialty.id;

  if (isCurrent) return { domain, specialty, state: "active", record };
  if (record?.mastered) return { domain, specialty, state: "mastered", record };
  if (record) return { domain, specialty, state: "completed", record };
  return { domain, specialty, state: "available" };
}
