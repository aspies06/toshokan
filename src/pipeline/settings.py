class EmbeddingModel:
    """
    Stores name of embedding model and the embedding size
    """
    def __init__(self, model_name, vector_size):
        self.model_name = model_name
        self.vector_size = vector_size

class Paths:
    """
    Stores the paths for the database and the source folder
    """
    def __init__(self, dbPath, sourcesPath):
        self.dbPath = dbPath
        self.sourcesPath = sourcesPath