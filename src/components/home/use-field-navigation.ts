"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { interviewPath, type InterviewLevel } from "@/components/interview/level";
import { domains } from "@/lib/domains";

import { resolveNode } from "./resolve-node";
import type { ResolvedNode } from "./types";
import { useGuestState } from "./use-guest-state";

/**
 * Shared between the home page's teaser list and the full `/fields`
 * directory — both resolve the same domain/specialty states off the same
 * guest progress and route into an interview the same way.
 */
export function useFieldNavigation() {
  const router = useRouter();
  const guest = useGuestState();
  const [lockNotice, setLockNotice] = useState<string | null>(null);
  // The chosen node, held while its level-picker dialog is open — the
  // interview route no longer asks for a level itself, so this has to be
  // resolved here, before the route is ever pushed.
  const [pendingNode, setPendingNode] = useState<ResolvedNode | null>(null);

  const byField = useMemo(
    () =>
      domains.map((domain) => ({
        domain,
        nodes: domain.specialties.map((specialty) =>
          resolveNode(domain, specialty, guest)
        ),
      })),
    [guest]
  );

  const activeNode = byField
    .flatMap((field) => field.nodes)
    .find((node) => node.state === "active");

  function handleEnter(node: ResolvedNode) {
    if (node.state === "locked") {
      // §6.1 — a locked node explains itself rather than doing nothing.
      setLockNotice(node.lockedReason ?? "Chưa thể bắt đầu chuyên môn này.");
      return;
    }
    setPendingNode(node);
  }

  function handleConfirmLevel(level: InterviewLevel) {
    if (!pendingNode) return;
    router.push(interviewPath(pendingNode.domain.id, pendingNode.specialty.id, level));
    setPendingNode(null);
  }

  function closeLevelPicker() {
    setPendingNode(null);
  }

  return {
    guest,
    byField,
    activeNode,
    lockNotice,
    handleEnter,
    pendingNode,
    handleConfirmLevel,
    closeLevelPicker,
  };
}
