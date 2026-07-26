import type { ModuleWorkspaceProps } from "../types";

export function TechWorkspace({ status }: ModuleWorkspaceProps) {
  return <div data-status={status} />;
}
