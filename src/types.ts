export type Severity = "info" | "low" | "medium" | "high" | "critical";

export type RedAgentStep = {
  id: string;
  message: string;
  intent: string;
  expectedSignal?: string;
};

export type RedAgentConfig = {
  id: string;
  name: string;
  goal: string;
  strategy: string;
  steps: RedAgentStep[];
};

export type ToolCall = {
  name: string;
  args: Record<string, string | boolean | number>;
};

export type ArenaEvent = {
  turn: number;
  red: RedAgentStep;
  blueMessage: string;
  toolCalls: ToolCall[];
  detections: Detection[];
};

export type Detection = {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
};

export type ArenaResult = {
  redAgent: Pick<RedAgentConfig, "id" | "name" | "goal">;
  events: ArenaEvent[];
  flagged: boolean;
};
