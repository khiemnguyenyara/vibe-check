import type { ModuleDefinition } from "../types";
import { getMarketingSystemPrompt } from "./prompt";
import { MarketingWorkspace } from "./workspace";

export const marketingModule: ModuleDefinition = {
  id: "marketing",
  label: "Marketing",
  description: "Mock interviews for marketing roles: campaign strategy, brand case studies.",
  getSystemPrompt: getMarketingSystemPrompt,
  Workspace: MarketingWorkspace,
};
