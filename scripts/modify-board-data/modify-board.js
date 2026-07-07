/**
 *
 * This file is a little script to help with the modification of officer data
 * located at src/lib/pubic/board/data/officers.json.
 *
 * Every semester the webmaster must keep the teams page up to date with
 * new updates to the board. It was done by manually editing the JSON file.
 * This script was made to make the experience of updating the board
 * a lot more relaxed I guess.
 *
 */

import { readFile } from 'fs/promises';
import { unlink, writeFile } from 'node:fs/promises';
import { stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';

// Read an input with prompt. Also determines what to do with SIGINT from Ctrl+C
async function readInput(prompt) {
  try {
    const result = await rl.question(prompt);
    return result;
  } catch (error) {
    if (error === 'AbortError' || error.code === 'ABORT_ERR') {
      console.log('Ctrl+C detected, exiting');
      process.exit(0);
    }
  }
}

// Fetch the current board json
async function getBoard() {
  const filePath = '../../src/lib/public/board/data/officers.json';
  try {
    const file = await readFile(filePath);
    const boardOfficers = JSON.parse(file);
    return boardOfficers;
  } catch (err) {
    console.error('Error reading officers:', err);
  }
}

// Should return a diff file, which is a copy of the current board json.
// This is the file that should be edited first
async function getDiff() {
  const filePath = '../../src/lib/public/board/data/officers-diff.json';
  try {
    const file = await readFile(filePath);
    const boardOfficers = JSON.parse(file);
    return boardOfficers;
  } catch (err) {
    console.error('Error reading officers:', err);
  }
}

// ALL changes should be written to a separate
// file before being committed in case a mistake is made.
async function writeToDiff(content) {
  const filePath = '../../src/lib/public/board/data/officers-diff.json';
  try {
    await writeFile(filePath, content);
  } catch (err) {
    console.log('Error writting to diff file: ', err);
    process.exit(1);
  }
}

async function deleteDiff() {
  const filePath = '../../src/lib/public/board/data/officers-diff.json';
  try {
    await unlink(filePath);
  } catch (err) {
    console.log('Error removing file: ', err);
  }
}

function findOfficer(boardOfficers, name) {
  return boardOfficers.find((o) => o.fullName.toLowerCase() === name.toLowerCase());
}

// =========== MAIN PROCESS ===========

const rl = readline.createInterface(input, output);

const boardJSON = await getBoard();
await writeToDiff(JSON.stringify(boardJSON));
const boardOfficers = await getDiff();
async function mainLoop() {
  while (true) {
    const option = await readInput(
      `
    ==== Modify Board Script ====\n
    What do you want to do?\n
    [ 1 ] Lookup board officer\n
    [ 2 ] Edit board data\n
    [ 3 ] View current diff\n
    [ 4 ] Commit changes\n
    [ 5 ] Quit\n
    `
    );
    console.log('You chose: ', option);
    switch (option) {
      case '1':
        const find = await readInput('Lookup: ');
        console.log('Looking up...');
        const officer = findOfficer(boardOfficers, find);
        if (!officer) {
          console.log('Unable to locate officer: ', find);
        } else {
          console.log(JSON.stringify(officer, null, 2));
        }
        await readInput('Press any key to continue: ');
        break;
      case '2':
        // todo
        break;
      case '3':
        // todo
        break;
      case '4':
        // todo
        break;
      case '5':
        // todo
        rl.close();
        await deleteDiff();
        process.exit(0);
      default:
        console.log('Invalid option, try again.');
        break;
    }
  }
}

mainLoop();
