/* Common paths for the application */
import path from 'node:path';
import fsSync from 'node:fs';
import { promises as fs } from 'node:fs';
import { app } from 'electron';

const appRoot = app.getAppPath();
const userDataFolder = path.join(app.getPath('userData'), 'UserData');
const sourcesFolder = path.join(userDataFolder, 'Sources');
const scriptsFolder = path.join(appRoot, 'src', 'pipeline');
const processScript = path.join(scriptsFolder, 'process_doc.py');
const dbFile = path.join(userDataFolder, 'library.db');
const settingsFile = path.join(userDataFolder, 'settings.json');

/**
 * Ensures that a folder exists, creating it if necessary.
 * @param {string} folderPath - The path to the folder to check.
 */
function ensureFolderExistsSync(folderPath) {
  try {
    fsSync.accessSync(folderPath);
  } catch (error) {
    fsSync.mkdirSync(folderPath, { recursive: true });
  }
}

/**
 * Ensures that a folder exists, creating it if necessary.
 * @param {string} folderPath - The path to the folder to check.
 */
async function ensureFolderExists(folderPath) {
  try {
    await fs.access(folderPath);
  } catch (error) {
    await fs.mkdir(folderPath, { recursive: true });
  }
}

/**
 * Ensures that a file exists, creating it if necessary.
 * @param {string} filePath - The file path
 * @param {string} content - The file content to write (if creating the file)
 */
function ensureFileExistsSync(filePath, content = '') {
    try {
        fsSync.accessSync(filePath);
    } catch (error) {
        fsSync.writeFileSync(filePath, content);
    }
}

/**
 * Ensures that a file exists, creating it if necessary.
 * @param {string} filePath - The path to the file to check.
 * @param {string} content - The content to write to the file if it doesn't exist.
 */
async function ensureFileExists(filePath, content = '') {
    try {
        await fs.access(filePath);
    } catch (error) {
        await fs.writeFile(filePath, content);
    }
}

// Create the necesssary folder structure
ensureFolderExistsSync(userDataFolder);
ensureFolderExistsSync(sourcesFolder);

export { 
    appRoot, 
    userDataFolder, 
    sourcesFolder, 
    scriptsFolder,
    dbFile,
    settingsFile,
    processScript,
    ensureFolderExists,
    ensureFolderExistsSync,
    ensureFileExists,
    ensureFileExistsSync
};
