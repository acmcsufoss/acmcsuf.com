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
 * To run the script: `node main.js`
 *
 * This script provides a few features that you will find useful.
 * 1 -> Find officer. Type an officers name and their info will be displayed.
 * [NOTE] The data that is displayed is the edited one, not the one currently present in production.
 *
 * 2 -> Edit officer. Provides a list of prompts to go through to edit/add an officer.
 *
 * 3 -> View current diff. The script writes to a copy of the board json before commiting changes to avoid mistakes.
 * You can compare your current changes to what is on the board json with this.
 *
 * 4 -> Commit changes. When you are confident and done with your changes to board, you can then write it to the original board json.
 *
 * 5 -> Exit. Exiting will not save your progress (As well as hitting Ctrl + C in the middle of using the script).
 *
 */

import {
  getJSON,
  writeToCopy,
  deleteCopy,
  commitChanges,
  officerJSON,
  copyJSON,
  tiersJSON,
} from './json-operations.js';
import { readInput, upperFirstLetters, closeRL } from './helpers.js';
import { execSync } from 'child_process';

// Tier mapping
function mapTier(tiers, tier) {
  try {
    return tiers[upperFirstLetters(tier)].id;
  } catch (err) {
    return undefined;
  }
}

async function viewDiff() {
  try {
    execSync(`git diff --no-index "${officerJSON}" "${copyJSON}"`, { stdio: 'inherit' });
  } catch {
    console.log('No Diff');
  }
}

// === Officer operations ===

function findOfficer(boardOfficers, name) {
  return boardOfficers.find((o) => o.fullName.toLowerCase() === name.toLowerCase());
}

async function editOfficer(officers, tiers) {
  const lookfor = await readInput('What officer do you want to edit/add? ');
  let officer = await findOfficer(officers, lookfor);
  let ifNew = false;
  if (!officer) {
    ifNew = true;
    console.log('Unable to locate ', lookfor, '. Making new officer');

    officer = {
      fullName: upperFirstLetters(lookfor),
      picture: '',
      positions: {},
      discord: '',
    };
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

    let term;
    while (true) {
      term = (await readInput('What term will you edit/add? (e.g. F25 or S26): ')).toUpperCase();

      if (/^[FS]\d{2}$/.test(term)) {
        break;
      }
      console.log('Invalid term. Please use the format F25 or S26.');
    }

    if (!officer.positions[term]) {
      officer.positions[term] = [];
    }

    while (true) {
      const title = await readInput('Officer title (leave blank to finish): ');

      if (title === '') {
        break;
      }

      const tier = mapTier(tiers, title);
      if (tier == undefined) {
        console.log(
          'Bad Title, please check the spelling and try again [Can be found in src/lib/public/board/data/tiers]'
        );
        continue;
      }

      officer.positions[term].push({
        title: upperFirstLetters(title),
        tier: mapTier(tiers, title),
      });
    }

    break;
  }

  console.log(JSON.stringify(officer, null, 2));
  while (true) {
    const confirmation = (await readInput('Are you okay with these changes? [y/n] ')).toLowerCase();
    if (confirmation === 'yes' || confirmation === 'y') {
      if (ifNew) {
        officers.push(officer);
      }
      writeToCopy(JSON.stringify(officers, null, 2));
      return officers;
    }

    if (confirmation === 'no' || confirmation === 'n') {
      return officers;
    }

    console.log('Invalid Input.');
  }
}
// =========== MAIN PROCESS ===========

const boardJSON = await getJSON(officerJSON);
await writeToCopy(JSON.stringify(boardJSON, null, 2));
let boardOfficers = await getJSON(copyJSON);

const tiers = await getJSON(tiersJSON);

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
    > `
    );
    console.log('You chose: ', option);
    switch (option) {
      case '1': {
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
      }
      case '2': {
        boardOfficers = await editOfficer(boardOfficers, tiers);
        break;
      }
      case '3': {
        viewDiff();
        break;
      }
      case '4': {
        while (true) {
          const confirmation = (
            await readInput('ARE YOU SURE YOU WANT TO COMMIT CHANGES? [y/n] ')
          ).toLowerCase();

          if (confirmation === 'yes' || confirmation === 'y') {
            await commitChanges(JSON.stringify(boardOfficers, null, 2));
            break;
          }

          if (confirmation === 'no' || confirmation === 'n') {
            console.log('Abandoning commit');
            break;
          }

          console.log('Invalid input.');
        }
        break;
      }
      case '5':
      case 'q': {
        closeRL();
        await deleteCopy();
        return;
      }
      default:
        console.log('Invalid option, try again.');
        break;
    }
  }
}

await mainLoop();
process.exit(0);
