/* Common paths for the application */
import path from 'node:path';
import fsSync from 'node:fs';
import { promises as fs } from 'node:fs';
import { app } from 'electron';

const appRoot = app.getAppPath();
const userDataFolder = path.join(app.getPath('userData'), 'UserData');
const sourcesFolder = path.join(userDataFolder, 'Sources');
const scriptsFolder = path.join(appRoot, 'src', 'pipeline');
const dbPath = path.join(userDataFolder, 'library.db');
const processScript = path.join(scriptsFolder, 'process_file.py');

// Ensure the user data folder exists before anything (e.g. db.js) tries to
// open a file within it, since DatabaseSync will not create missing directories.
fsSync.mkdirSync(userDataFolder, { recursive: true });

// Ensure the sources folder exists before anything tries to open a file within it
fsSync.mkdirSync(sourcesFolder, { recursive: true });

export { 
    appRoot, 
    userDataFolder, 
    sourcesFolder, 
    scriptsFolder,
    dbPath,
    processScript
};
