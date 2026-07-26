import type { ModuleWorkspaceProps } from "../types";

export function MarketingWorkspace({ status }: ModuleWorkspaceProps) {
  return <div data-status={status} />;
}
