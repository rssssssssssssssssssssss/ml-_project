from sentence_transformers import SentenceTransformer

model = SentenceTransformer("BAAI/bge-m3")


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