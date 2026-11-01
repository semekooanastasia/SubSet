// Palaiž testa serveri un lietotni vienā komandā: npm start
// Ctrl+C aptur abus procesus, lai neviens nepaliek karājoties portā.
import { spawn } from 'node:child_process';

const processes = [];

function run(name, args, env = {}) {
  const child = spawn('npm', ['run', name, ...args], {
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
  child.on('exit', (code) => {
    if (code !== 0 && code !== null) stopAll(code);
  });
  processes.push(child);
  return child;
}

function stopAll(code = 0) {
  for (const child of processes) {
    if (!child.killed) child.kill('SIGTERM');
  }
  process.exit(code);
}

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));

// Scenāriju var nomainīt demonstrācijai: MOCK_SCENARIO=error npm start
run('mock', [], { MOCK_SCENARIO: process.env.MOCK_SCENARIO || 'ok' });
run('dev', []);
