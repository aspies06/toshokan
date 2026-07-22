// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, webUtils } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    // gets all the user collections
    getCollections: () => ipcRenderer.invoke('get:collections'),
    // gets full path of file from the file object
    getFilePath: (fileObj) => webUtils.getPathForFile(fileObj),
    // uploads content from a file or remote URL
    uploadContent: (fileOrUrl) => ipcRenderer.invoke('upload:content', fileOrUrl)
});