import "server-only";

import type { ServerInterviewModule } from "./server-types";
import { techServerModule } from "./tech/server";

/**
 * Server-side mirror of registry.ts.
 *
 * docs/hla.md §5 makes the registry the single explicit list of domains, and
 * §3 forbids Core from reaching into a module directly. Both still hold —
 * there are now two audiences, so there are two registries: `registry.ts`
 * for the browser (label, description, Workspace) and this one for the route
 * handler (bank, rubric, scorer).
 *
 * Adding a domain still means adding one line to each registry it
 * participates in, and nothing else. A domain may appear in `registry.ts`
 * without appearing here — that is exactly what `marketing` does, and the
 * handler answers MODULE_NOT_FOUND for it rather than crashing.
 */
const serverModuleRegistry: Record<string, ServerInterviewModule> = {
  [techServerModule.id]: techServerModule,
};

export function getServerModule(id: string): ServerInterviewModule | undefined {
  // Guard against prototype keys ("constructor", "__proto__") reaching a
  // plain-object lookup from an untrusted moduleId (§5.1).
  return Object.hasOwn(serverModuleRegistry, id)
    ? serverModuleRegistry[id]
    : undefined;
}
