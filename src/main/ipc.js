import path from 'node:path';
import { promises as fs } from 'node:fs';
import { appRoot, userDataFolder, sourcesFolder, scriptsFolder } from './files.js';
import * as db from './db.js';
import { invokeScript } from './script.js';

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
 * Ensures that the user data folder exists, creating it if necessary.
 */
async function ensureSourcesPath() {
  try {
    await fs.access(sourcesFolder);
  } catch (error) {
    await fs.mkdir(sourcesFolder, { recursive: true });
  }
}

/**
 * Converts a URL string into a safe file name.
 *
 * @param {string} url - The URL to convert.
 * @param {number} maxLength - Max allowed length (default: 255).
 * @returns {string} Safe file name.
 */
function urlToFilename(url, maxLength = 255) {
  if (!url) return 'file';

  try {
    // Decode URL-encoded characters (e.g., '%20' -> ' ')
    const decodedUrl = decodeURIComponent(url);

    // Strip protocol (http://, https://, ftp://, etc.)
    let cleanUrl = decodedUrl.replace(/^[a-zA-Z]+:\/\//, '');

    // Replace invalid/reserved filename characters with underscores
    // Handles Windows (\ / : * ? " < > |) and POSIX (/) restrictions
    let filename = cleanUrl.replace(/[\\/:"*?<>|]/g, '_');

    // Clean up redundant consecutive underscores, leading/trailing dots and spaces
    filename = filename
      .replace(/_+/g, '_')
      .replace(/^[\s._]+|[\s._]+$/g, '');

    // Fallback if cleaning stripped everything
    if (!filename) return 'file';

    // Truncate to safe operating system length limit
    return filename.slice(0, maxLength);
  } catch (e) {
    // Fallback in case decodeURIComponent fails on malformed URIs
    return 'file';
  }
}

/**
 * Determines whether a string is a remote URL (not a Windows file path).
 * @param {string} fileOrUrl The string to check.
 * @returns {boolean} True if the string is a remote URL, False otherwise.
 */
function isRemoteUrl(fileOrUrl) {
  if (!URL.canParse(fileOrUrl)) return false;
  const { protocol } = new URL(fileOrUrl);
  return ['https:', 'http:'].includes(protocol);
}

/**
 * Uploads content from a file or remote URL to the processing script.
 * @param {string} fileOrUrl The file path or URL to upload.
 * @returns {Promise<void>} A promise that resolves when the upload is complete.
 */
async function uploadContent(fileOrUrl) {
  await ensureSourcesPath();
  if (isRemoteUrl(fileOrUrl)) {
    return await invokeScript(processScript, 
      ['--url', fileOrUrl, '--to', path.join(sourcesFolder, urlToFilename(fileOrUrl))]
    );
  }

  let filePath = fileOrUrl;
  if (fileOrUrl.startsWith('file://')) {
    filePath = convertFileUrlToPath(new URL(fileOrUrl));
  }

  return await invokeScript(processScript, 
    ['--file', filePath, '--to', path.join(sourcesFolder, path.basename(filePath, path.extname(filePath)))]
  );
}

export { uploadContent };