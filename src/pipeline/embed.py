from __future__ import annotations
import struct
from docling_core.transforms.chunker.hybrid_chunker import HybridChunker
from docling_core.types.doc import DoclingDocument
from sentence_transformers import SentenceTransformer
from db import LibraryDB
from settings import Settings

def serialize_embedding(vector: list[float]) -> bytes:
    """
    Converts the embedding from floats to raw bytes.
    Args:
        vector (list[float]): The embedding vector to serialize.
    """
    return struct.pack(f"{len(vector)}f", *vector)

def embed_chunks(doc: DoclingDocument, source_id: int, db: LibraryDB, settings: Settings) -> None:
    """
    Chunks the document and creates embeddings for the chunks
    Args:
        doc: The document to embed.
        source_id (int): The ID of the source document in the database.
        db (LibraryDB): The database instance to store the embeddings.
        settings (Settings): The application settings.
    """
    chunker = HybridChunker()
    chunk_iter = chunker.chunk(doc)
    embed_model = SentenceTransformer(settings.embedding.model)

    texts = [chunker.contextualize(chunk) for chunk in chunk_iter]
    embeddings = embed_model.encode(texts)
    embedding_chunks = [
        {"content": text, "token_count": len(text.split()), "embedding": serialize_embedding(embedding.tolist())}
        for text, embedding in zip(texts, embeddings)
    ]

    for i, chunk in enumerate(embedding_chunks):
        chunk_id = db.add_chunk(source_id, i, chunk, False)  # Do not auto-commit here; commit after adding all chunks