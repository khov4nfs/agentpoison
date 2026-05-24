import React from "react";
import { render } from "ink";
import { loadRedAgent } from "./agents/loadRedAgent.js";
import { runArena } from "./arena/runArena.js";
import { DemoApp } from "./ui/DemoApp.js";

const redAgent = await loadRedAgent("agents/red/trust_builder.yaml");
const result = await runArena({
  redAgent,
  projectRoot: process.cwd()
});

render(<DemoApp result={result} />);
