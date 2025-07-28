#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔍 Verifying test environment...\n');

// Check if required files exist
const requiredFiles = [
  'src/test/extension.test.ts',
  'src/test/unit.test.ts',
  'out/test/extension.test.js',
  'out/test/unit.test.js',
];

console.log('📁 Checking required files:');
let allFilesExist = true;

requiredFiles.forEach((file) => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) {
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please run:');
  console.log('   pnpm run compile');
  process.exit(1);
}

console.log('\n🧪 Running test verification...');

// Run a quick test to verify the environment
const testCommand = 'pnpm';
const testArgs = ['test'];

const child = spawn(testCommand, testArgs, {
  stdio: 'pipe',
  cwd: path.resolve(__dirname, '..'),
  shell: true,
});

let output = '';
let errorOutput = '';

child.stdout.on('data', (data) => {
  output += data.toString();
});

child.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

child.on('close', (code) => {
  console.log('\n📊 Test Results:');

  if (code === 0) {
    console.log('✅ All tests passed!');

    // Parse test output for summary
    const lines = output.split('\n');
    const summaryLine = lines.find((line) => line.includes('passing'));
    if (summaryLine) {
      console.log(`📈 ${summaryLine.trim()}`);
    }

    console.log('\n🎉 Test environment is working correctly!');
    console.log('\n💡 Available test commands:');
    console.log('   pnpm test          - Run all tests');
    console.log('   pnpm test:unit     - Run unit tests');
    console.log('   pnpm test:watch    - Run tests in watch mode');
  } else {
    console.log('❌ Tests failed!');
    console.log('\n🔍 Error details:');
    console.log(errorOutput || output);

    console.log('\n🛠️  Troubleshooting steps:');
    console.log('1. Make sure dependencies are installed: pnpm install');
    console.log('2. Compile the project: pnpm run compile');
    console.log('3. Check VS Code version compatibility');
    console.log('4. See TESTING_GUIDE.md for more help');
  }

  process.exit(code);
});

child.on('error', (error) => {
  console.error('❌ Error running tests:', error.message);
  console.log('\n🛠️  Please check:');
  console.log('1. Node.js and pnpm are installed');
  console.log('2. You are in the correct directory');
  console.log('3. Dependencies are installed: pnpm install');
  process.exit(1);
});
