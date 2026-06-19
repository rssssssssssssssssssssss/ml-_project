from loader import load_documents
from chunker import chunk_text
from embedding_service import embed_documents
from vector_store import save_index

documents = load_documents()

all_chunks = []

for doc in documents:

    print("=" * 80)
    print(doc["filename"])

    chunks = chunk_text(doc["text"])

    print(f"Total Chunks: {len(chunks)}")

    all_chunks.extend(chunks)

print("\nTotal chunks from all documents:", len(all_chunks))

print("\nGenerating embeddings for all chunks...")

vectors = embed_documents(all_chunks)

save_index(vectors, all_chunks)

print(f"\nEmbedding Shape: {vectors.shape}")

print("\nDone.")