import type { ComponentType } from "react";

/**
 * See docs/interface-contracts.md — this file is the compile-time
 * enforcement of that contract. Any change here must update every
 * ModuleDefinition implementation in the same commit (see §5, versioning).
 */

export type ExperienceLevel = "junior" | "mid" | "senior" | "staff";

export interface InterviewSessionContext {
  readonly sessionId: string;
  readonly candidateName?: string;
  readonly experienceLevel: ExperienceLevel;
  readonly focusAreas: readonly string[];
  readonly locale: string;
}

/**
 * Must be a pure function of `context`: no Date.now()/Math.random()/env
 * reads, no I/O, never throws (missing optional fields get domain-level
 * defaults). See docs/interface-contracts.md §3.2.
 */
export type SystemPromptBuilder = (
  context: InterviewSessionContext
) => string;

export type SessionStatus = "idle" | "in_progress" | "paused" | "completed";

export interface WorkspaceSubmission {
  readonly type: string;
  readonly payload: unknown;
  readonly submittedAt: string;
}

export interface ModuleWorkspaceProps {
  readonly context: InterviewSessionContext;
  readonly status: SessionStatus;
  readonly onSubmit: (submission: WorkspaceSubmission) => void;
}

export interface ModuleDefinition {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly getSystemPrompt: SystemPromptBuilder;
  readonly Workspace: ComponentType<ModuleWorkspaceProps>;
}
