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
import { stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';

async function getBoard() {
  try {
    const filePath = '../../src/lib/public/board/data/officers.json';
    const file = await readFile(filePath);
    const boardOfficers = JSON.parse(file);
    //console.log(boardOfficers);
    return boardOfficers;
  } catch (err) {
    console.error('Error reading officers:', err);
  }
}

function findOfficer(boardOfficers, name) {
  return boardOfficers.find((o) => o.fullName.toLowerCase() === name.toLowerCase());
}

const rl = readline.createInterface(input, output);

const boardOfficers = await getBoard();

async function mainLoop() {
  while (true) {
    const option = await rl.question(
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
        const find = await rl.question('lookup: ');

        console.log('Looking up...');
        const officer = findOfficer(boardOfficers, find);
        if (!officer) {
          console.log('Unable to locate officer: ', find);
        } else {
          console.log(officer);
        }
        console.log('---- done ----');
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
        break;
      default:
        console.log('Invalid option, try again.');
    }
  }
}

mainLoop();
