import struct
from docling_core.transforms.chunker.hybrid_chunker import HybridChunker
from sentence_transformers import SentenceTransformer
from db import LibraryDB

def serialize_embedding(vector: list[float]) -> bytes:
    """
    Converts the embedding from floats to raw bytes.
    """
    return struct.pack(f"{len(vector)}f", *vector)

def create_chunks(doc, source_id: int, db: LibraryDB):
    """
    Chunks the document and creates embeddings for the chunks
    """
    chunker = HybridChunker()
    chunk_iter = chunker.chunk(doc)
    embed_model = SentenceTransformer("all-MiniLM-L6-v2")

    texts = [chunker.contextualize(chunk) for chunk in chunk_iter]
    embeddings = embed_model.encode(texts)
    embedding_chunks = [
        {"content": text, "token_count": len(text.split()), "embedding": serialize_embedding(embedding.tolist())}
        for text, embedding in zip(texts, embeddings)
    ]

    for i, chunk in enumerate(embedding_chunks):
        chunk_id = db.add_chunk(source_id, i, chunk)