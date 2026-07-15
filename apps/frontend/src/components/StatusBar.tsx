import React from "react";
import { Box, Text } from "ink";

interface StatusBarProps {
  status: string;
  currentAgent?: string;
  progress: number;
}

export function StatusBar({ status, currentAgent, progress }: StatusBarProps): React.ReactElement {
  const statusColor = getStatusColor(status);
  const progressBar = renderProgress(progress);

  return (
    <Box flexDirection="column" borderStyle="round" borderColor={statusColor} paddingX={1}>
      <Box>
        <Text bold>Status: </Text>
        <Text color={statusColor}>{status.toUpperCase()}</Text>
        {currentAgent && (
          <>
            <Text> │ Agent: </Text>
            <Text color="yellow">{currentAgent}</Text>
          </>
        )}
      </Box>
      <Box marginTop={1}>
        <Text>Progress: {progressBar} </Text>
        <Text color="gray">{Math.round(progress * 100)}%</Text>
      </Box>
    </Box>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case "running":
      return "green";
    case "waiting":
      return "yellow";
    case "failed":
      return "red";
    case "completed":
      return "blue";
    default:
      return "gray";
  }
}

function renderProgress(progress: number): string {
  const filled = Math.round(progress * 20);
  const empty = 20 - filled;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}]`;
}
