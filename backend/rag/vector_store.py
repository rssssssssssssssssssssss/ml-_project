import faiss
import numpy as np
import json
from pathlib import Path
from config import VECTOR_DIR

VECTOR_DIR.mkdir(parents=True, exist_ok=True)

def save_index(vectors, chunks):
    vectors = np.asarray(vectors, dtype=np.float32)

    dimension = vectors.shape[1]

    index = faiss.IndexFlatIP(dimension)

    index.add(vectors)

    faiss.write_index(
        index,
        str(VECTOR_DIR / "index.faiss")
    )

    metadata = []

    for i, chunk in enumerate(chunks):
        metadata.append({
            "id": i,
            "text": chunk
        })

    with open(
        VECTOR_DIR / "metadata.json",
        "w",
        encoding="utf-8"
    ) as f:
        json.dump(
            metadata,
            f,
            ensure_ascii=False,
            indent=4
        )

    print(f"Saved {len(chunks)} chunks.")