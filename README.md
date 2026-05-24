# AgentPoison

Adversarial arena for testing how coding agents get socially engineered.

Coming soon: reproducible red-agent attack chains, realtime boundary detection, and a terminal demo that shows an agent trusting the wrong instruction one small step at a time.

## Quick Start

```bash
npm install
npm run demo
```

Run a non-interactive arena pass and write a JSON log:

```bash
npm run arena -- --red agents/red/trust_builder.yaml --out runs/trust-builder.json
```

## MVP Scope

- TypeScript arena runner
- YAML-based red agents
- Simulated blue agent adapter
- Rule-based attack success detector
- Ink terminal UI for the launch demo
- Attack taxonomy docs

## Red Agents

Build order is demo-first:

1. `trust_builder`
2. `memory_poisoner`
3. `tool_hijacker`
4. `mcp_impersonator`
5. `salami_slicer`

`trust_builder` comes first because it is the clearest public demo: the red agent earns trust through harmless steps, then asks for one small boundary violation after the blue agent has already started complying.
