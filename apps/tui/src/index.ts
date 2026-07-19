import { render } from 'ink';
import React from 'react';
import { App } from './App.js';

process.stdout.write('\x1b[48;2;13;17;23m\x1Bc');

const stdout = process.stdout;
// Reserve one line so Ink's throttledLog path is used (no clearTerminal flicker)
// when the rendered output reaches the terminal height. Without this, the root
// Yoga node's computed height matches stdout.rows, and Ink's onRender falls
// into the clearTerminal branch on every keystroke, causing the screen shake.
const height = (stdout.rows ?? 24) - 1;
const width = stdout.columns ?? 80;

const { waitUntilExit } = render(
  React.createElement(App, { height, width }),
  {
    stdout,
    debug: false,
    exitOnCtrlC: true,
  },
);

waitUntilExit().then(() => {
  process.stdout.write('\x1b[0m\x1b[2J\x1b[H');
  process.exit(0);
});
