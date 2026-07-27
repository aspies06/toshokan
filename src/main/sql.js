/*
 * SQL statements.
 */
const embeddingDimension = 384;

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
        is_active BOOLEAN NOT NULL DEFAULT 1, -- Allows user to toggle/de-select source in RAG query
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
        embedding float[${embeddingDimension}]
    );
    `

const selectCollections = 'SELECT id, name, description, image_url FROM collections ORDER BY update_time DESC';
const selectCollection = 'SELECT id, name, description, image_url FROM collections WHERE id = ?';
const insertCollection = 'INSERT INTO collections (name, description, image_url) VALUES (?, ?, ?)';
const insertSource = 'INSERT INTO sources (collection_id, title, author, source_type, file_path, is_active) VALUES (?, ?, ?, ?, ?, ?)';
const selectSources = `SELECT 
            id, 
            collection_id, 
            title, 
            author, 
            source_type, 
            file_path, 
            is_active, 
            create_time 
        FROM sources 
        WHERE collection_id = ? 
        ORDER BY create_time DESC
    `

export { ddl, selectCollection, selectCollections, selectSources, insertCollection, insertSource };