import type { ModuleDefinition } from "./types";
import { techModule } from "./tech";
import { marketingModule } from "./marketing";

export const moduleRegistry: Record<string, ModuleDefinition> = {
  [techModule.id]: techModule,
  [marketingModule.id]: marketingModule,
};

export function getModule(id: string): ModuleDefinition | undefined {
  return moduleRegistry[id];
}
