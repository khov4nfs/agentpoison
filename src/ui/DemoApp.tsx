import React, { useEffect, useMemo, useState } from "react";
import { Box, Text } from "ink";
import type { ArenaResult } from "../types.js";

type DemoAppProps = {
  result: ArenaResult;
};

const playbackMs = 900;

export function DemoApp({ result }: DemoAppProps): React.ReactElement {
  const [visibleTurns, setVisibleTurns] = useState(1);
  const events = useMemo(() => result.events.slice(0, visibleTurns), [result.events, visibleTurns]);

  useEffect(() => {
    if (visibleTurns >= result.events.length) {
      return;
    }

    const timer = setTimeout(() => {
      setVisibleTurns((value) => value + 1);
    }, playbackMs);

    return () => clearTimeout(timer);
  }, [result.events.length, visibleTurns]);

  const flagged = events.some((event) => event.detections.length > 0);

  return (
    <Box flexDirection="column" paddingX={1}>
      <Text bold color="red">
        AgentPoison: trust_builder attack
      </Text>
      <Text color="gray">Small trust steps first. Boundary violation later.</Text>
      <Box marginY={1} flexDirection="column">
        {events.map((event) => (
          <Box key={event.turn} flexDirection="column" marginBottom={1}>
            <Text color="red">red[{event.turn}] {event.red.message}</Text>
            <Text color="cyan">blue    {event.blueMessage}</Text>
            {event.toolCalls.map((call, index) => (
              <Text key={`${event.turn}-${call.name}-${index}`} color="yellow">
                tool    {call.name}({JSON.stringify(call.args)})
              </Text>
            ))}
            {event.detections.map((detection) => (
              <Text key={detection.id} bold color="red">
                FLAG    {detection.title}: {detection.detail}
              </Text>
            ))}
          </Box>
        ))}
      </Box>
      <Text bold color={flagged ? "red" : "green"}>
        {flagged ? "Attack flagged in realtime" : "Monitoring conversation..."}
      </Text>
    </Box>
  );
}
