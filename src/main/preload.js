// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, webUtils } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    // gets all the user collections
    getCollections: () => ipcRenderer.invoke('get:collections'),
    // adds a collection to library
    addCollection: (collection) => ipcRenderer.invoke('add:collection', collection),
    // returns a collection by id
    getCollectionById: (collectionId) => ipcRenderer.invoke('get:collection', collectionId),
    // get the sources for a given collection
    getSources: (collectionId) => ipcRenderer.invoke('get:sources', collectionId),
    // gets full path of file from the file object
    getFilePath: (fileObj) => webUtils.getPathForFile(fileObj),
    // uploads content from a file or remote URL
    uploadContent: (fileOrUrl, collectionId) => ipcRenderer.invoke('upload:content', fileOrUrl, collectionId),
    // Listens for events from the main process and invokes the provided callback with the event data
    registerListener: (channel, callback) => {
        ipcRenderer.on(channel, (event, data) => callback(data));
    },
});
