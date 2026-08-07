import fs from 'node:fs';
import { 
  settingsFile, 
  ensureFileExists, 
  ensureFileExistsSync 
} from './files';

const defaultSettings = {
  embedding: {
    model: 'all-MiniLM-L6-v2',
    vectorDimensions: 384
  }
};

/**
 * Gets the application settings.
 * @returns {JSON} The application settingscle
 */
async function getSettings() {
  await ensureFileExists(settingsFile, JSON.stringify(defaultSettings));
  return fs.readFile(settingsFile, 'utf-8')
    .then(data => JSON.parse(data))
    .catch(err => {
      console.error('Error reading settings file:', err);
      throw err;
    });
}

/**
 * Gets the application settings synchronously.
 * @returns {JSON} The application settings
 */
function getSettingsSync() {
  ensureFileExistsSync(settingsFile, JSON.stringify(defaultSettings));
  try {
    const data = fs.readFileSync(settingsFile, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading settings file:', err);
    throw err;
  }
}

/**
 * Writes the application settings.
 * @param {JSON} settings - The application settings
 * @returns {Promise<void>} A promise that resolves when the settings are written
 */
async function writeSettings(settings) {
  return fs.writeFile(settingsFile, JSON.stringify(settings, null, 2), 'utf-8')
    .catch(err => {
      console.error('Error writing settings file:', err);
      throw err;
    });
}

export { getSettings, getSettingsSync, writeSettings };