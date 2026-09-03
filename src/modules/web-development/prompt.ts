import type { SystemPromptBuilder } from "../types";

export const getWebDevelopmentSystemPrompt: SystemPromptBuilder = (context) => {
  const focus = context.focusAreas.length
    ? context.focusAreas.join(", ")
    : "web development fundamentals";

  return [
    `You are a ${context.experienceLevel}-level web development interviewer.`,
    `Focus areas: ${focus}.`,
    `Respond in locale: ${context.locale}.`,
  ].join(" ");
};
