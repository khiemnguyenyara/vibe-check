"use client";

import { useState } from "react";
import { Code2, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import type { ModuleWorkspaceProps, WorkspaceSubmission } from "../types";

/**
 * The Tech domain's Workspace pane — a scratchpad for code and diagrams,
 * kept separate from the chat (docs/user-stories.md US-04).
 *
 * The conversation loop that used to live here now belongs to the Core
 * Session Engine (src/components/interview/use-interview-session.ts):
 * docs/interface-contracts.md §4.2 forbids a Workspace from owning
 * SessionStatus or talking to a service directly. What remains obeys the
 * contract exactly — local draft state only, `onSubmit` as the sole channel
 * up to Core, and read-only once the session completes.
 */

interface CodeSubmissionPayload {
  readonly code: string;
}

export function TechWorkspace({ status, onSubmit }: ModuleWorkspaceProps) {
  const [code, setCode] = useState("");

  const isReadOnly = status === "completed" || status === "paused";
  const canAttach = !isReadOnly && code.trim().length > 0;

  function handleAttach() {
    if (!canAttach) return;
    const payload: CodeSubmissionPayload = { code: code.trim() };
    const submission: WorkspaceSubmission = {
      type: "tech-code",
      payload,
      submittedAt: new Date().toISOString(),
    };
    onSubmit(submission);
  }

  return (
    <div
      className="flex h-full min-h-0 flex-col bg-background"
      data-status={status}
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-quest-surface-border px-5 py-4">
        <h2 className="flex items-center gap-2 text-sm font-bold tracking-tight">
          <Code2 className="size-4 text-interview-accent" />
          Khu vực làm bài
        </h2>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAttach}
          disabled={!canAttach}
          className="h-8 shrink-0 gap-1.5 rounded-full border border-quest-surface-border text-xs"
        >
          <Paperclip className="size-3.5" />
          Đính kèm
        </Button>
      </header>

      <div className="min-h-0 flex-1 p-4">
        <Textarea
          value={code}
          onChange={(event) => setCode(event.target.value)}
          disabled={isReadOnly}
          spellCheck={false}
          placeholder={
            "// Nháp code, phác thảo sơ đồ hoặc ghi chú ý tưởng ở đây.\n// Nhấn “Đính kèm” để gửi kèm câu trả lời."
          }
          className="h-full min-h-0 w-full resize-none rounded-sm border border-quest-surface-border bg-background px-3 py-2.5 font-mono text-xs leading-relaxed shadow-none focus-visible:border-interview-accent focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
