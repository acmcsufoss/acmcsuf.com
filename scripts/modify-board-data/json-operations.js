import { readFile } from 'fs/promises';
import { unlink, writeFile } from 'node:fs/promises';

export const officerJSON = '../../src/lib/public/board/data/officers.json';
export const copyJSON = './officers-diff.json';
export const tiersJSON = '../../src/lib/public/board/data/tiers.json';

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

// For commiting changes to the board.
export async function commitChanges(content) {
  try {
    await writeFile(officerJSON, content);
  } catch (err) {
    console.log('Error writting to diff file: ', err);
    process.exit(1);
  }
}

// Deletes the copy. Should be done when the user exits the tool
export async function deleteCopy() {
  try {
    await unlink(copyJSON);
  } catch (err) {
    console.log('Error removing file: ', err);
  }
}
