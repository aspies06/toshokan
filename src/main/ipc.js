import path from 'node:path';
import { promises as fs } from 'node:fs';
import { app } from 'electron';
import { invokeScript } from './script.js';

const appRoot = app.getAppPath();
const userDataFolder = path.join(app.getPath('userData'), 'UserData');
const collectionsPath = path.join(userDataFolder, 'collections.json');
const scriptsFolder = path.join(appRoot, 'src', 'pipeline');
const processScript = path.join(scriptsFolder, 'process.py');

/**
 * Converts a file URL to a local file path.
 * @param {URL} fileUrl 
 * @returns The file path if the input is a file URL
 */
function convertFileUrlToPath(fileUrl) {
  return fileUrl.toString().replace('file://', '');
}

/**
 * Ensures that the user data folder exists, creating it if necessary.
 */
async function ensureUserDataPath() {
  try {
    await fs.access(userDataFolder);
  } catch (error) {
    await fs.mkdir(userDataFolder, { recursive: true });
  }
}

/**
 * Fetches collections from the collections.json file.
 * @returns {Promise<Array>} A promise resolving to the list of collections.
 */
async function getCollections() {
  await ensureUserDataPath();
  try {
    await fs.access(collectionsPath);
    const raw = await fs.readFile(collectionsPath, 'utf-8');
    const data = JSON.parse(raw);
    return data.collections;
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(collectionsPath, JSON.stringify({ collections: [] }));
      return [];
    }
    throw error;
  }
};

/**
 * Uploads content from a file or remote URL to the processing script.
 * @param {string} fileOrUrl The file path or URL to upload.
 * @returns {Promise<void>} A promise that resolves when the upload is complete.
 */
async function uploadContent(fileOrUrl) {
  let filePath = fileOrUrl;
  if (URL.canParse(fileOrUrl)) {
    const parsedUrl = new URL(fileOrUrl);
    // if not file URL, process the remote URL directly
    if (parsedUrl.protocol !== 'file:') {
      await invokeScript(processScript, ['--url', fileOrUrl]);
      return;
    }
    filePath = convertFileUrlToPath(parsedUrl);
  }
  await invokeScript(processScript, ['--file', filePath]);
}

export { getCollections, uploadContent };