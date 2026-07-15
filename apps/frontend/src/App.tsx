import React from "react";
import { Box, Text } from "ink";
import { StatusBar } from "./components/StatusBar.js";
import { TaskList } from "./components/TaskList.js";
import { AgentPanel } from "./components/AgentPanel.js";

interface AppProps {
  status?: string;
  currentAgent?: string;
  progress?: number;
}

export function App({ status = "idle", currentAgent, progress = 0 }: AppProps): React.ReactElement {
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          ═══ Orion CLI - Multi-Agent Orchestrator ═══
        </Text>
      </Box>

      <StatusBar status={status} currentAgent={currentAgent} progress={progress} />

      <Box marginTop={1}>
        <AgentPanel />
      </Box>

      <Box marginTop={1}>
        <TaskList />
      </Box>
    </Box>
  );
}
