import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
const fs = require('fs').promises;

const userDataPath = path.join(app.getPath('userData'), 'UserData');
const collectionsPath = path.join(userDataPath, 'collections.json');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
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

async function ensureUserDataPath() {
  try {
    await fs.access(userDataPath);
  } catch (error) {
    await fs.mkdir(userDataPath, { recursive: true });
  }
}

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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  ipcMain.handle('get:collections', async () => {
    return getCollections();
  });

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
