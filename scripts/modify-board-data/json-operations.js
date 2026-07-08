import { readFile } from 'fs/promises';
import { unlink, writeFile } from 'node:fs/promises';

export const officerJSON = '../../src/lib/public/board/data/officers.json';
export const copyJSON = '../../src/lib/public/board/data/officers-diff.json';

// Get a json file from /src/lib/public/board/data
export async function getJSON(filePath) {
  try {
    const file = await readFile(filePath);
    const json = JSON.parse(file);
    return json;
  } catch (err) {
    console.error('Error reading officers:', err);
  }
}

// ALL changes should be written to a separate
// file before being committed in case a mistake is made.
export async function writeToCopy(content) {
  try {
    await writeFile(copyJSON, content);
  } catch (err) {
    console.log('Error writting to diff file: ', err);
    process.exit(1);
  }
}

export async function deleteCopy() {
  try {
    await unlink(copyJSON);
  } catch (err) {
    console.log('Error removing file: ', err);
  }
}

export async function editOfficer(officers) {
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
