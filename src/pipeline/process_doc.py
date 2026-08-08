import os
import argparse
import base64
import hashlib
import uuid
from pathlib import Path
from docling.document_converter import DocumentConverter
from docling_core.types.doc import DoclingDocument
from embed import embed_chunks
from db import LibraryDB
from source import Source
from settings import load_settings

# Change the file extension for the given file.
def change_extension(file_name: str, new_extension: str) -> str:
    if not new_extension.startswith('.'):
        new_extension = f".{new_extension}"
    path = Path(file_name)
    return str(path.with_suffix(new_extension))

# Get the SHA-1 hash of a file and return it as a base64-encoded string.
def get_file_sha1_base64(file_path: str):
    hasher = hashlib.sha1()
    with open(file_path, 'rb') as f:
        chunk_size = 65536
        while chunk := f.read(chunk_size):
            hasher.update(chunk)
    raw_hash_bytes = hasher.digest()
    base64_bytes = base64.b64encode(raw_hash_bytes)
    return base64_bytes.decode('utf-8')


def process_doc(location: str, cid: int, config_path: str):
    """
    Process the uploaded file and extract text content.
    Args:
        location (str): The location of the file to process.
        cid (int): The collection ID for the source document.
        config_path (str): The path to the configuration folder.
    """
    settings = load_settings(os.path.join(config_path, "settings.json"))
    dbPath = os.path.join(config_path, "library.db")
    converter = DocumentConverter()
    doc = converter.convert(location).document
    with LibraryDB(dbPath) as db:
        try:
            source_id = save_doc(location, cid, db, doc, config_path)
            embed_chunks(doc, int(source_id), db, settings)
            db.conn.commit()  # Commit after adding all chunks
        except Exception as e:
            db.conn.rollback()
            raise e

def save_doc(location: str, cid: int, db: LibraryDB, doc: DoclingDocument, config_path: str):
    """
    Save the document in the database
    Args:
        location (str): The location of the file to process, either a local file path or a URL.
        cid (int): The collection ID for the source document.
        db: (LibraryDB) The database.
        doc: (DoclingDocument) The document to save.
        config_path (str): The path to the configuration folder.
    """
    file_hash = get_file_sha1_base64(Path(location))
    if db.file_hash_exists(file_hash):
        raise Exception(f"File with location {location} already exists in the database.")
    file_path = os.path.join(config_path, "Sources", change_extension(str(uuid.uuid4()), '.md'))

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(doc.export_to_markdown())

    source = Source(cid, doc.name, 'Unknown', 'text', file_path, file_hash)
    return db.add_source(source, False)  # Do not auto-commit here; commit after adding chunks


# Main entry point for the script    
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process a file or URL.")
    parser.add_argument('--loc', type=str, help='Path of the file to process.', required=True)
    parser.add_argument('--cid', type=int, help='Collection ID for the source.', required=True)
    parser.add_argument('--config', type=str, help='Path of the root configuration folder', required=True)

    args = parser.parse_args()
    process_doc(args.loc, args.cid, args.config)
    print(f"Successfully processed file: {args.loc}")