import type { SystemPromptBuilder } from "../types";

export const getTechSystemPrompt: SystemPromptBuilder = (context) => {
  const focus = context.focusAreas.length
    ? context.focusAreas.join(", ")
    : "general software engineering";

  return [
    `You are a ${context.experienceLevel}-level technical interviewer.`,
    `Focus areas: ${focus}.`,
    `Respond in locale: ${context.locale}.`,
  ].join(" ");
};
