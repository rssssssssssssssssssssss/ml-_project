from pathlib import Path
from sentence_transformers import SentenceTransformer

MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "bge-m3"

model = SentenceTransformer(str(MODEL_PATH))


def embed_documents(texts):
    return model.encode(
        texts,
        normalize_embeddings=True,
        convert_to_numpy=True,
    )


def embed_queries(queries):
    prompts = [
        f"Represent this sentence for searching relevant passages: {q}"
        for q in queries
    ]

    return model.encode(
        prompts,
        normalize_embeddings=True,
        convert_to_numpy=True,
    )