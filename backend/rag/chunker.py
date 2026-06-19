from typing import List

def chunk_text(text: str,
               chunk_size: int = 250,
               overlap: int = 50) -> List[str]:

    words = text.split()

    chunks = []

    start = 0

    while start < len(words):

        end = min(start + chunk_size, len(words))

        chunks.append(" ".join(words[start:end]))

        start += chunk_size - overlap

    return chunks