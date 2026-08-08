import path from 'node:path';
import { app, BrowserWindow, ipcMain } from 'electron';
import started from 'electron-squirrel-startup';
import { addCollection, getCollectionById, getCollections, getSources } from './db.js';
import { uploadContent } from './ipc.js';

const initWidth = 1200;
const initHeight = 800;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: initWidth,
    height: initHeight,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// Registers event handlers
registerEventHandlers = () => {
    // Handle IPC event for adding a collection
  ipcMain.handle('add:collection', async (event, collection) => {
    return addCollection(collection.name, collection.description);
  });
  
  // Handle IPC event for fetching collections
  ipcMain.handle('get:collections', async () => {
    return getCollections();
  });

  // Handle IPC event for fetching individual collection
  ipcMain.handle('get:collection', async (event, collectionId) => {
    return getCollectionById(collectionId);
  });

  // Handle IPC event for fetching sources (for collection)
  ipcMain.handle('get:sources', async (event, collectionId) => {
    return await getSources(collectionId);
  });

  // Handle IPC event for uploading content
  ipcMain.handle('upload:content', async (event, fileOrUrl, collectionId) => {
    return await uploadContent(fileOrUrl, collectionId);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  registerEventHandlers();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
