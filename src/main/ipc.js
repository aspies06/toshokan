import path from 'node:path';
import { promises as fs } from 'node:fs';
import { appRoot, userDataFolder, sourcesFolder, scriptsFolder, processScript, dbPath } from './files.js';
import * as db from './db.js';
import { invokeScript } from './script.js';

/**
 * Uploads content from a file or remote URL to the processing script.
 * @param {string} fileOrUrl The file path or URL to upload.
 * @returns {Promise<void>} A promise that resolves when the upload is complete.
 */
async function uploadContent(fileOrUrl, collectionId) {
  return await invokeScript(processScript, 
    ['--loc', fileOrUrl, '--cid', collectionId]
  );
}

export { uploadContent };