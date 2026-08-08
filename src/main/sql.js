/*
 * SQL statements.
 */

/**
 * Gets the DDL statements for creating the necessary 
 * tables in the database.
 * @param {number} vectorDimension - The dimension of the vector embeddings.
 * @returns {string} - The DDL statements as a string
 */
function getTables(vectorDimension) {
    const ddl =
    `
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS collections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        collection_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        author TEXT,
        source_type TEXT NOT NULL CHECK(source_type IN ('audio', 'video', 'text')),
        file_path TEXT, -- Local path to the original file on the desktop
        file_hash TEXT, -- Hash of the original file
        create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS chunks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_id INTEGER NOT NULL,
        chunk_index INTEGER NOT NULL,
        content TEXT NOT NULL,
        token_count INTEGER,
        FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE
    );

    -- Vector Table (Using sqlite-vec virtual table for embedding storage & similarity search)
    CREATE VIRTUAL TABLE IF NOT EXISTS vec_chunks USING vec0(
        chunk_id INTEGER PRIMARY KEY,
        embedding float[${vectorDimension}]
    );
    `
    return ddl;
}

const selectCollections = 'SELECT id, name, description, image_url FROM collections ORDER BY update_time DESC';
const selectCollection = 'SELECT id, name, description, image_url FROM collections WHERE id = ?';
const insertCollection = 'INSERT INTO collections (name, description, image_url) VALUES (?, ?, ?)';
const insertSource = 'INSERT INTO sources (collection_id, title, author, source_type, file_path) VALUES (?, ?, ?, ?, ?)';
const selectSources = `SELECT 
            id, 
            collection_id, 
            title, 
            author, 
            source_type, 
            file_path, 
            create_time 
        FROM sources 
        WHERE collection_id = ? 
        ORDER BY create_time DESC
    `

export { getTables, selectCollection, selectCollections, selectSources, insertCollection, insertSource };