import { readFile } from "node:fs/promises";
import { parse } from "yaml";
import type { RedAgentConfig, RedAgentStep } from "../types.js";

function assertString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid red agent config: ${field} must be a non-empty string`);
  }

  return value;
}

function normalizeStep(value: unknown, index: number): RedAgentStep {
  if (!value || typeof value !== "object") {
    throw new Error(`Invalid red agent config: steps[${index}] must be an object`);
  }

  const step = value as Record<string, unknown>;

  return {
    id: assertString(step.id, `steps[${index}].id`),
    message: assertString(step.message, `steps[${index}].message`),
    intent: assertString(step.intent, `steps[${index}].intent`),
    expectedSignal: typeof step.expectedSignal === "string" ? step.expectedSignal : undefined
  };
}

export async function loadRedAgent(path: string): Promise<RedAgentConfig> {
  const source = await readFile(path, "utf8");
  const doc = parse(source) as Record<string, unknown>;

  if (!Array.isArray(doc.steps) || doc.steps.length === 0) {
    throw new Error("Invalid red agent config: steps must be a non-empty array");
  }

  return {
    id: assertString(doc.id, "id"),
    name: assertString(doc.name, "name"),
    goal: assertString(doc.goal, "goal"),
    strategy: assertString(doc.strategy, "strategy"),
    steps: doc.steps.map(normalizeStep)
  };
}
