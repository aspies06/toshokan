import fs from 'node:fs';
import { 
  settingsFile, 
  ensureFileExists, 
  ensureFileExistsSync 
} from './files';

// Default settings for the application
const defaultSettings = {
  embedding: {
    model: 'all-MiniLM-L6-v2',
    vectorDimensions: 384
  },
  llm: {
    model: 'google/gemma-4-E4B-it'
  },
  windowDimensions: {
    width: 1200,
    height: 800
  }
};

/**
 * Gets the application settings.
 * @returns {JSON} The application settings
 */
async function getSettings() {
  await ensureFileExists(settingsFile, JSON.stringify(defaultSettings));
  return fs.promises.readFile(settingsFile, 'utf-8')
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
  return fs.promises.writeFile(settingsFile, JSON.stringify(settings, null, 2), 'utf-8')
    .catch(err => {
      console.error('Error writing settings file:', err);
      throw err;
    });
}

/**
 * Saves the application settings, merging with the current settings.
 * @param {object} settings - The application settings
 */
async function saveSettings(settings) {
  try {
    const currentSettings = await getSettings();
    await writeSettings({ ...currentSettings, ...settings });
  } catch (err) {
    console.error('Error reading current settings:', err);
    throw err;
  }
}

export { getSettings, getSettingsSync, writeSettings, saveSettings };