from dataclasses import dataclass

@dataclass
class Source:
    cid: int
    title: str
    author: str
    source_type: str
    file_path: str
    file_hash: str