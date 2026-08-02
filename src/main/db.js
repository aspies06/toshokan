/*
 * The SQLite database, and data access layer.
 */
import { DatabaseSync } from 'node:sqlite';
import { dbPath } from './files';
import * as sql from './sql'

const db = new DatabaseSync(dbPath, {
    allowExtension: true,
    timeout: 1000
});
// Enable WAL mode for multi-process concurrency
db.exec('PRAGMA journal_mode = WAL;');

try {
    // load the vector SQLite extension
    require('sqlite-vec').load(db);
} catch (e) {
    console.error('Failed to load the SQLLite Vector extension: ', e);
}

// Load tables if needed
db.exec(sql.ddl);

/**
 * Adds a collection to the library
 * @param {string} name - The name of the collection
 * @param {string} description 
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

// /**
//  * Adds a source to the collection
//  * @param {number} collectionId 
//  * @param {object} source
//  * @returns {number} - last row inserted
//  */
// function addSource(collectionId, source)
// {
//     const query = db.prepare(sql.insertSource);
//     const result = query.run(
//         collectionId, 
//         source.title, 
//         source.author, 
//         source.sourceType, 
//         source.path, 
//     );
//     return { id: result.lastInsertRowid };
// }

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