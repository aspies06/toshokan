/* Common paths for the application */
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { app } from 'electron';

const appRoot = app.getAppPath();
const userDataFolder = path.join(app.getPath('userData'), 'UserData');
const sourcesFolder = path.join(userDataFolder, 'Sources');
const scriptsFolder = path.join(appRoot, 'src', 'pipeline');
const dbPath = path.join(userDataFolder, 'libary.db');

export { 
    appRoot, 
    userDataFolder, 
    sourcesFolder, 
    scriptsFolder,
    dbPath
};
