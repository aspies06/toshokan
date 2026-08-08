import sqlite3
import sqlite_vec
from source import Source

class LibraryDB:
    """
    A class to manage the SQLite database for storing sources, chunks, and embeddings/
    """
    def __init__(self, db_path: str):
        self.db_path = db_path

    def connect(self) -> None:
        """
        Connect to SQLite database and load the vector database
        """
        self.conn = sqlite3.connect(self.db_path)
        self.conn.enable_load_extension(True)
        sqlite_vec.load(self.conn)
        self.conn.enable_load_extension(False)
        self.conn.execute("PRAGMA journal_mode = WAL;")

    def add_source(self, source: Source, auto_commit: bool = True) -> int:
        """
        Add a source to the database and return the source ID. Raises an exception if the insertion fails.
        Args:
            source (Source): The source object to add to the database.
            auto_commit (bool): Whether to commit the transaction automatically.
        Returns:
            int: The ID of the newly added source.
        """
        cur = self.conn.cursor()
        cur.execute("BEGIN")
        cur.execute(
            """
            INSERT INTO sources(
            collection_id, title, author, source_type, file_path, file_hash)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (source.cid, source.title, source.author, source.source_type, source.file_path, source.file_hash)
        )
        if auto_commit:
            self.conn.commit()

        if cur.lastrowid is None:
            raise Exception("Failed to add source to the database.")
        else:
            return cur.lastrowid

    def add_chunk(self, source_id: int, chunk_id: int, chunk: dict, auto_commit: bool = True) -> int:
        """
        Add a chunk and its embedding to the database. Raises an exception if the insertion fails.
        Args:
            source_id (int): The ID of the source document.
            chunk_id (int): The index of the chunk.
            chunk (dict): A dictionary containing the chunk's content, token count, and embedding.
            auto_commit (bool): Whether to commit the transaction automatically.
        Returns:
            int: The ID of the newly added chunk.
        """
        cur = self.conn.cursor()
        cur.execute(
            """
            INSERT INTO chunks(
            source_id, chunk_index, content, token_count)
            VALUES (?, ?, ?, ?)
            """,
            (source_id, chunk_id, chunk["content"], chunk["token_count"])
        )
        id = cur.lastrowid

        self.conn.execute(
            """
            INSERT INTO vec_chunks(
            chunk_id, embedding)
            VALUES (?, ?)
            """,
            (id, chunk["embedding"])
        )
        if auto_commit:
            self.conn.commit()

        if id is None:
            raise Exception("Failed to add chunk to the database.")
        else:
            return id

    def file_hash_exists(self, file_hash: str) -> bool:
        """
        Check if a file with the given hash already exists in the database.
        """
        cur = self.conn.cursor()
        cur.execute("SELECT file_hash FROM sources WHERE file_hash = ?", (file_hash,))
        return cur.fetchone() is not None

    def close(self) -> None:
        """
        Check if the connection is open before committing and closing it.
        """
        if self.conn:
            self.conn.close()

    def __enter__(self):
        """
        Context manager methods to allow using the LibraryDB class with a 'with' statement.
        """
        self.connect()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        """
        Exit method to close the connection when exiting the 'with' block.
        """
        self.close()