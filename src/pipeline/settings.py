from dataclasses import dataclass
import json

@dataclass
class EmbeddingModel:
    """
    Stores name of embedding model and the embedding size
    """
    model: str
    vectorDimensions: int

@dataclass
class Settings:
    """
    Stores the settings for the application
    """
    embedding: EmbeddingModel


def load_settings(settings_file) -> Settings:
    """
    Load settings from a JSON file and return a Settings object.
    """
    with open(settings_file, 'r') as f:
        data = json.load(f)

    # Construct the nested EmbeddingModel first
    embedding_data = data.get("embedding", {})
    if isinstance(embedding_data, dict):
        embedding_obj = EmbeddingModel(**embedding_data)
    else:
        raise ValueError("'embedding' in settings must be an object with 'model' and 'vectorDimensions'")

    # Now construct Settings with the proper EmbeddingModel instance
    data["embedding"] = embedding_obj
    return Settings(**data)