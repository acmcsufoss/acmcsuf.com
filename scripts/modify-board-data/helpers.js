import { stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';
import { deleteCopy } from './json-operations.js';

const rl = readline.createInterface(input, output);

// Read an input with prompt. Also determines what to do with SIGINT from Ctrl+C
export async function readInput(prompt) {
  try {
    const result = await rl.question(prompt);
    return result;
  } catch (error) {
    if (error === 'AbortError' || error.code === 'ABORT_ERR') {
      console.log('Ctrl + C SIGINT detected. Aborting');
      deleteCopy();
      process.exit(1);
    }
  }
}

export function closeRL() {
  rl.close();
}

// wtf is this function chain? Here is what it does:
// "this is an example" => "This Is An Example"
// Since tiers.json key values all have uppercased first characters
// As well as names in officers.json
export function upperFirstLetters(str) {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
