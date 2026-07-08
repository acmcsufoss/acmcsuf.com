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

import { stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';
import { getJSON, writeToCopy, deleteCopy } from './json-operations.js';

const officerJSON = '../../src/lib/public/board/data/officers.json';
const copyJSON = '../../src/lib/public/board/data/officers-diff.json';

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

function findOfficer(boardOfficers, name) {
  return boardOfficers.find((o) => o.fullName.toLowerCase() === name.toLowerCase());
}

async function editOfficer(officers) {
  const lookfor = await readInput('What officer do you want to edit/add?');
  let officer = await findOfficer(officers, lookfor);
  if (!officer) {
    console.log('Unable to locate ', lookfor, '. Making new officer');

    officer = {
      fullName: lookfor
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      picture: '',
      discord: '',
      positions: {},
    };

    officers.push(officer);
  }

  // Gaballa, why are you switching between string literal and template literal?
  // because my lsp said so
  while (true) {
    const editPic = (await readInput("Edit this officer's picture link? [y/n]: ")).toLowerCase();
    if (editPic === 'n' || editPic === 'no') {
      break;
    }

    if (editPic === 'y' || editPic === 'yes') {
      const picLink = await readInput('New picture link: ');
      officer.picture = picLink;
      break;
    }

    console.log('Invalid input, please try again');
  }

  while (true) {
    const editDiscord = (await readInput("Edit this officer's discord? [y/n]: ")).toLowerCase();
    if (editDiscord === 'n' || editDiscord === 'no') {
      break;
    }

    if (editDiscord === 'y' || editDiscord === 'yes') {
      const newDiscord = await readInput('New discord: ');
      officer.discord = newDiscord;
      break;
    }

    console.log('Invalid input, please try again');
  }

  while (true) {
    const editPositions = (await readInput("Edit this officer's positions? [y/n]: ")).toLowerCase();

    if (editPositions === 'n' || editPositions === 'no') {
      break;
    }

    if (editPositions !== 'y' && editPositions !== 'yes') {
      console.log('Invalid input, please try again.');
      continue;
    }

    const term = (
      await readInput('What term will you edit/add? (e.g. F25 or S26): ')
    ).toUpperCase();

    if (!officer.positions[term]) {
      officer.positions[term] = [];
    }

    while (true) {
      const title = await readInput('Officer title (leave blank to finish): ');

      if (title === '') {
        break;
      }

      officer.positions[term].push({
        title,
        tier: 0, // TODO: map tier to title with the json
      });
    }

    break;
  }

  console.log(officer);
}
// =========== MAIN PROCESS ===========

const rl = readline.createInterface(input, output);

const boardJSON = await getJSON(officerJSON);
await writeToCopy(JSON.stringify(boardJSON));
const boardOfficers = await getJSON(copyJSON);

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
        await editOfficer(boardOfficers);
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
        await deleteCopy();
        process.exit(0);
      default:
        console.log('Invalid option, try again.');
        break;
    }
  }
}

mainLoop();
