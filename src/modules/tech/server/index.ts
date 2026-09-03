import "server-only";

import type { ServerInterviewModule } from "../../server-types";
import { TECH_SESSION_LENGTH } from "./content";
import {
  resolveEntry,
  resolveQuestion,
  selectQuestion,
} from "./question-service";
import { scoreAnswer, scoreMultipleChoice } from "./scorer";

/**
 * The Tech module's server half — the adapter between `ServerInterviewModule`
 * (what the route handler consumes) and the question service (what actually
 * knows the content).
 *
 * Deliberately thin. Everything that used to live here — id formatting, bank
 * indexing, the projection that strips answer keys — moved into
 * ./question-service.ts, leaving this file as pure contract satisfaction. The
 * split matters because the route handler is the one caller that must not
 * know how content is organized: give it a module with a bank inlined and the
 * next specialty's content shape becomes a route change.
 */

/**
 * Mock-only pacing. The scorer and bank lookup are instant, so without this
 * the "AI is thinking" affordance never renders long enough to read and the
 * UI flickers. Delete it the moment a real model supplies natural latency —
 * it is simulation, and simulation that outlives its purpose becomes a bug.
 */
const MOCK_LATENCY_MS = 700;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const techServerModule: ServerInterviewModule = {
  id: "tech",
  sessionLength: TECH_SESSION_LENGTH,

  async selectQuestion(context, turnIndex, specialtyId) {
    const resolved = selectQuestion(
      specialtyId,
      context.experienceLevel,
      turnIndex,
      context.locale
    );
    if (!resolved) return null;

    // After the null check, so an out-of-range turn ends the session
    // immediately instead of stalling for a latency that models nothing.
    await delay(MOCK_LATENCY_MS);

    return resolved.question;
  },

  async resolveQuestion(id, locale) {
    return resolveQuestion(id, locale)?.question ?? null;
  },

  async evaluate(question, answer) {
    if (question.type === "multiple_choice") {
      // `question` is trusted here, not re-derived from the client: the
      // route only ever calls `evaluate` with the value it got back from
      // this same module's `selectQuestion`/`resolveQuestion` moments
      // earlier (see `resolveGradableQuestion` in the route), which already
      // re-resolved it from the server's own content by id (specs/002 §5.2).
      // What's missing from that value — deliberately, by projection — is
      // `correctOptionIndex`, so only the entry needs a second lookup, not
      // the whole question.
      //
      // That second lookup still means `decodeQuestionId` runs twice per
      // graded MC turn — once inside the route's earlier `resolveQuestion`
      // call, once here. Considered and left as is: the two calls are
      // separate `ServerInterviewModule` methods the route invokes
      // independently, with no request-scoped place to cache a decode
      // between them — `techServerModule` is a module-level singleton
      // shared across concurrent requests, so caching on it would be shared
      // mutable state, not a speedup. The only way to actually skip the
      // second decode is threading a resolved-entry handle through
      // `evaluate`'s signature, which would put a tech-specific concept on
      // the interface every future module has to carry. That's the wrong
      // trade for a saved string split.
      const entry = resolveEntry(question.id);
      if (!entry || entry.type !== "multiple_choice") {
        throw new Error(
          `Cannot resolve multiple-choice bank entry for "${question.id}"`
        );
      }

      return scoreMultipleChoice(question, answer, entry.correctOptionIndex);
    }

    return scoreAnswer(question, answer);
  },
};
