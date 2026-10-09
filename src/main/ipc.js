import path from 'node:path';
import { promises as fs } from 'node:fs';
import { BrowserWindow } from 'electron';
import * as db from './db.js';
import { invokeScript, startScript } from './script.js';
import { getSettings } from './settings.js'
import { 
  sourcesFolder,
  userDataFolder,
  processScript,
  serverScript,
  ensureFolderExists
} from './files.js';

/**
 * Broadcasts an event to the first available renderer window.
 * @param {string} channel - The IPC channel to send the event on
 * @param {object} data - The data to send to the renderer process
 */
function broadcastToWindow(channel, data) {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length > 0) {
    const firstWindow = allWindows[0];
    firstWindow.webContents.send(channel, data);
  }
}

/**
 * Uploads content from a file or remote URL to the processing script.
 * @param {string} fileOrUrl The file path or URL to upload.
 * @param {number} collectionId The ID of the collection to associate with the uploaded content.
 * @returns {Promise<string>} The result of the processing script.
 */
async function uploadContent(fileOrUrl, collectionId) {
  await ensureFolderExists(sourcesFolder);
  try {
    const result = await invokeScript(processScript, 
      ['--loc', fileOrUrl, '--cid', collectionId, '--config', userDataFolder]
    );
    // broadcastToWindow('upload:complete', { fileOrUrl, collectionId, result });
    return Promise.resolve(result);
  } catch (err) {
    // broadcastToWindow('upload:failed', { fileOrUrl, collectionId, err });
    return Promise.reject(err);
  }
}

let serverShell = null;
const SERVER_PORT = 8000;

/**
 * Creates a server for the specified model and port
 * @returns {PythonShell} serverShell - The PythonShell instance for the running server script.
 */
async function createServer() {
  if (serverShell) return serverShell;
  serverShell = await startScript(serverScript,
    ['--port', SERVER_PORT]
  );
  serverShell.on('close', () => { serverShell = null; });
  return serverShell;
}

/**
 * Terminates the server when the app exits.
 */
function stopServer() {
  serverShell?.terminate();
  serverShell = null;
}

export { uploadContent, createServer, stopServer, broadcastToWindow };