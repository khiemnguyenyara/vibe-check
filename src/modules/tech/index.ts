import type { ModuleDefinition } from "../types";
import { getTechSystemPrompt } from "./prompt";
import { TechWorkspace } from "./workspace";

export const techModule: ModuleDefinition = {
  id: "tech",
  label: "Technology",
  description: "Mock interviews for software engineering roles: coding, system design, behavioral.",
  getSystemPrompt: getTechSystemPrompt,
  Workspace: TechWorkspace,
};
