import os
import argparse
from pathlib import Path
import base64
import hashlib
import uuid
from docling.document_converter import DocumentConverter
from embed import create_chunks
from db import LibraryDB
from source import Source
from settings import EmbeddingModel, Paths

embed_model = EmbeddingModel("all-MiniLM-L6-v2", 384) #hard-coded model for now
paths = Paths(r"C:\Users\spies\AppData\Roaming\Toshokan LM\UserData\library.db", r"C:\Users\spies\AppData\Roaming\Toshokan LM\UserData\Sources") # hard coded paths for now

def change_extension(file_name: str, new_extension: str) -> str:
    """
    Change the file extension for the given file
    """
    if not new_extension.startswith('.'):
        new_extension = f".{new_extension}"
    path = Path(file_name)
    return str(path.with_suffix(new_extension))

def get_file_sha1_base64(file_path):
    """
    Create a SHA-1 hasher that reads the file in 64KB chunks and returns the base64-encoded hash as a string
    """
    hasher = hashlib.sha1()
    with open(file_path, 'rb') as f:
        chunk_size = 65536
        while chunk := f.read(chunk_size):
            hasher.update(chunk)
    raw_hash_bytes = hasher.digest()
    base64_bytes = base64.b64encode(raw_hash_bytes)
    return base64_bytes.decode('utf-8')

def process_doc(loc, format='markdown'):
    """
    Process the uploaded file and extract text content.
    """
    converter = DocumentConverter()
    doc = converter.convert(loc).document
    with LibraryDB(paths.dbPath) as db:
        source_id = save_doc(loc, db, doc, format)
        create_chunks(doc, int(source_id), db)
        
def save_doc(loc, db, doc, format='markdown'):
    """
    Save the doc in the database
    """
    file_hash = get_file_sha1_base64(Path(loc))
    if db.file_hash_exists(file_hash):
        raise Exception(f"File with location {loc} already exists in the database.")
    file_path = os.path.join(paths.sourcesPath, change_extension(str(uuid.uuid4()), '.md'))

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(doc.export_to_markdown())

    source = Source(cid, doc.name, 'Unknown', 'text', file_path, file_hash)
    return db.add_source(source)

# Main entry point for the script    
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process a file or URL.")
    parser.add_argument('--loc', type=str, help='Path to the file to process.', required=True)
    parser.add_argument('--cid', type=int, help='Collection ID for the source.', required=True)

    args = parser.parse_args()

    global cid
    cid = args.cid

    process_doc(args.loc)
    print(f"Successfully processed file: {args.loc}")