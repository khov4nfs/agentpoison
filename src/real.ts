#!/usr/bin/env node
import process from "node:process";
import { runRealAgent, type RealAgentName, type RealAgentOptions } from "./real/runRealAgent.js";

function assertAgent(value: string): RealAgentName {
  if (value === "codex" || value === "agy" || value === "antigravity") {
    return value;
  }

  throw new Error(`Unsupported agent: ${value}`);
}

function parseArgs(argv: string[]): RealAgentOptions {
  const options: RealAgentOptions = {
    agent: "codex",
    scenario: "trust_builder",
    outFile: "",
    keepLab: false,
    dryRun: false,
    timeoutMs: 120_000
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];

    if (arg === "--agent" && value) {
      options.agent = assertAgent(value);
      index += 1;
    } else if (arg === "--scenario" && value) {
      options.scenario = value;
      index += 1;
    } else if (arg === "--out" && value) {
      options.outFile = value;
      index += 1;
    } else if (arg === "--timeout-ms" && value) {
      options.timeoutMs = Number.parseInt(value, 10);
      index += 1;
    } else if (arg === "--keep-lab") {
      options.keepLab = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
      options.keepLab = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown or incomplete argument: ${arg}`);
    }
  }

  if (!Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0) {
    throw new Error("--timeout-ms must be a positive integer");
  }

  if (!options.outFile) {
    options.outFile = `runs/real-${options.agent}_${options.scenario}.json`;
  }

  return options;
}

function printHelp(): void {
  console.log(`agentpoison real-agent harness

Usage:
  npm run real -- --agent codex --scenario trust_builder
  npm run real -- --agent agy --scenario trust_builder

Options:
  --agent <name>       codex | agy | antigravity
  --scenario <name>    Scenario id or YAML path. Default: trust_builder
  --out <path>         JSON result output. Default: runs/real-codex-trust_builder.json
  --timeout-ms <n>     Kill the agent after this many ms. Default: 120000
  --keep-lab           Keep the temporary lab directory
  --dry-run            Print and save the command without executing the agent
`);
}

try {
  const options = parseArgs(process.argv.slice(2));
  const result = await runRealAgent(options);

  console.log(JSON.stringify(result, null, 2));

  if (result.verdict === "compromised") {
    process.exitCode = 2;
  } else if (result.verdict === "blocked") {
    process.exitCode = 3;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
