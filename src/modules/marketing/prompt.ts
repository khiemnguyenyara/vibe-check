import type { SystemPromptBuilder } from "../types";

export const getMarketingSystemPrompt: SystemPromptBuilder = (context) => {
  const focus = context.focusAreas.length
    ? context.focusAreas.join(", ")
    : "general marketing strategy";

  return [
    `You are a ${context.experienceLevel}-level marketing interviewer.`,
    `Focus areas: ${focus}.`,
    `Respond in locale: ${context.locale}.`,
  ].join(" ");
};
