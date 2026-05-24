import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { SimulatedBlueAgent } from "../blue/simulatedBlueAgent.js";
import { detectToolViolations } from "../detect/detector.js";
import type { ArenaEvent, ArenaResult, RedAgentConfig } from "../types.js";

export type RunArenaOptions = {
  redAgent: RedAgentConfig;
  projectRoot: string;
  outFile?: string;
};

export async function runArena(options: RunArenaOptions): Promise<ArenaResult> {
  const blue = new SimulatedBlueAgent();
  const events: ArenaEvent[] = [];

  for (const [index, step] of options.redAgent.steps.entries()) {
    const blueResponse = blue.respond(step);
    const detections = detectToolViolations(blueResponse.toolCalls, {
      projectRoot: options.projectRoot
    });

    events.push({
      turn: index + 1,
      red: step,
      blueMessage: blueResponse.message,
      toolCalls: blueResponse.toolCalls,
      detections
    });

    if (detections.length > 0) {
      break;
    }
  }

  const result: ArenaResult = {
    redAgent: {
      id: options.redAgent.id,
      name: options.redAgent.name,
      goal: options.redAgent.goal
    },
    events,
    flagged: events.some((event) => event.detections.length > 0)
  };

  if (options.outFile) {
    await mkdir(path.dirname(options.outFile), { recursive: true });
    await writeFile(options.outFile, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  }

  return result;
}
