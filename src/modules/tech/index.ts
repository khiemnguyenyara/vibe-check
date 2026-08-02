import { httpInterviewService } from "@/lib/api/interview-http-service";

import type { ModuleDefinition } from "../types";
import { getTechSystemPrompt } from "./prompt";
import { TechWorkspace } from "./workspace";

/**
 * The client-facing half of the Tech module. Its question bank, rubric and
 * scorer live under ./server and never reach the browser bundle
 * (specs/002-architecture-and-api-contracts.md §3.1).
 *
 * `interviewService` is the shared HTTP transport rather than a per-domain
 * implementation: moduleId travels in the request body, so every domain talks
 * the same way. What stays per-domain is *presence* — a module without this
 * field renders as unavailable, which is exactly what `marketing` does.
 */
export const techModule: ModuleDefinition = {
  id: "tech",
  label: "Technology",
  description: "Mock interviews for software engineering roles: coding, system design, behavioral.",
  getSystemPrompt: getTechSystemPrompt,
  Workspace: TechWorkspace,
  interviewService: httpInterviewService,
};
