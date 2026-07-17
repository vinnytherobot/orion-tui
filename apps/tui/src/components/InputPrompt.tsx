import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useState } from 'react';

interface InputPromptProps {
  title: string;
  placeholder?: string;
  masked?: boolean;
  onSubmit: (value: string) => void;
  onCancel?: () => void;
}

export function InputPrompt({ title, placeholder, masked, onSubmit, onCancel }: InputPromptProps) {
  const [value, setValue] = useState('');

  useInput((_input, key) => {
    if (key.escape) {
      onCancel?.();
    }
  });

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
      <Text bold color="cyan">{title}</Text>
      <Box marginTop={1}>
        <TextInput
          value={value}
          onChange={setValue}
          onSubmit={onSubmit}
          placeholder={placeholder}
          mask={masked ? '*' : undefined}
        />
      </Box>
      <Box marginTop={1}>
        <Text color="gray" dimColor>[Enter] Submit  [Esc] Cancel</Text>
      </Box>
    </Box>
  );
}
