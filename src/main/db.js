/*
 * The SQLite database, and data access layer.
 */
import { DatabaseSync } from 'node:sqlite';
import { dbFile } from './files';
import * as sql from './sql'
import { getSettingsSync } from './settings.js';

const db = new DatabaseSync(dbFile, {
    allowExtension: true,
    timeout: 1000
});
// Enable WAL mode for multi-process concurrency
db.exec('PRAGMA journal_mode = WAL;');
// load the vector SQLite extension
require('sqlite-vec').load(db);

// Load tables if needed
const settings = getSettingsSync();
db.exec(sql.getTables(settings.embedding.vectorDimensions));

/**
 * Adds a collection to the library
 * @param {string} name - The name of the collection
 * @param {string} description - The description of the collection
 * @param {string} imageUrl - The URL of the collection's image
 * @returns {number} - The last row inserted
 */
function addCollection(name, description, imageUrl = null)
{
    const query = db.prepare(sql.insertCollection);
    const result = query.run(name, description, imageUrl);
    return { id: result.lastInsertRowid };
}

/**
 * Selects all collections.
 * @returns {Array<object>} - The collections
 */
function getCollections() {
    const query = db.prepare(sql.selectCollections);
    const rows = query.all();
    return rows.map (collection => ({
        id: collection.id,
        name: collection.name,
        description: collection.description,
        imageUrl: collection.image_url
    }));
}

/**
 * Gets a collection by its ID.
 * @param {number} collectionId - The collection id
 * @returns {object|null} - The collection or null if not found
 */
function getCollectionById(collectionId) {
    const query = db.prepare(sql.selectCollection);
    const row = query.get(collectionId);
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        imageUrl: row.image_url
    };
}

/**
 * Gets all sources for the given collection id.
 * @param {number} collectionId - The collection id
 * @returns {Array<object>} - The collection sources
 */
function getSources(collectionId) {
    const query = db.prepare(sql.selectSources);
    const rows = query.all(collectionId);
    return rows.map(source => ({
        id: source.id,
        collectionId: source.collection_id,
        title: source.title,
        author: source.author,
        sourceType: source.source_type,
        filePath: source.file_path,
        createTime: source.create_time
    }));
}

export { addCollection, getCollections, getCollectionById, getSources }