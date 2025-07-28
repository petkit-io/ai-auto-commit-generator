#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const isWatch = args.includes('--watch');
const isUnit = args.includes('--unit');

// Build the command
let command = 'pnpm';
let commandArgs = [];

if (isUnit) {
  commandArgs.push('test:unit');
} else if (isWatch) {
  commandArgs.push('test:watch');
} else {
  commandArgs.push('test');
}

console.log(`Running: ${command} ${commandArgs.join(' ')}`);

// Spawn the process
const child = spawn(command, commandArgs, {
  stdio: 'inherit',
  cwd: path.resolve(__dirname, '..'),
  shell: true,
});

child.on('error', (error) => {
  console.error('Error running tests:', error);
  process.exit(1);
});

child.on('close', (code) => {
  console.log(`Test process exited with code ${code}`);
  process.exit(code);
});
