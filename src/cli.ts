#!/usr/bin/env node
import process from "node:process";
import { loadRedAgent } from "./agents/loadRedAgent.js";
import { runArena } from "./arena/runArena.js";

type CliOptions = {
  red: string;
  out?: string;
  projectRoot: string;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    red: "agents/red/trust_builder.yaml",
    projectRoot: process.cwd()
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];

    if (arg === "--red" && value) {
      options.red = value;
      index += 1;
    } else if (arg === "--out" && value) {
      options.out = value;
      index += 1;
    } else if (arg === "--project-root" && value) {
      options.projectRoot = value;
      index += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown or incomplete argument: ${arg}`);
    }
  }

  return options;
}

function printHelp(): void {
  console.log(`agentpoison

Usage:
  agentpoison --red agents/red/trust_builder.yaml --out runs/trust-builder.json

Options:
  --red <path>           Red agent YAML file
  --out <path>           Optional JSON log output
  --project-root <path>  Project boundary for detector checks
`);
}

const options = parseArgs(process.argv.slice(2));
const redAgent = await loadRedAgent(options.red);
const result = await runArena({
  redAgent,
  projectRoot: options.projectRoot,
  outFile: options.out
});

console.log(JSON.stringify(result, null, 2));

if (result.flagged) {
  process.exitCode = 2;
}
