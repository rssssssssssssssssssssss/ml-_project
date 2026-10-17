import json
import faiss
import numpy as np

from rag.config import VECTOR_DIR
from rag.embedding_service import embed_queries


class Retriever:

    def __init__(self):

        self.index = faiss.read_index(
            str(VECTOR_DIR / "index.faiss")
        )

        with open(
            VECTOR_DIR / "metadata.json",
            "r",
            encoding="utf-8"
        ) as f:

            self.metadata = json.load(f)

    def search(self, query, top_k=3):

        query_vector = embed_queries([query])

        query_vector = np.asarray(
            query_vector,
            dtype=np.float32
        )

        scores, indices = self.index.search(
            query_vector,
            top_k
        )

        results = []

        for score, idx in zip(scores[0], indices[0]):

            results.append({
                "score": float(score),
                "text": self.metadata[idx]["text"]
            })

        return results