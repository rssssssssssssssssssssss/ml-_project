from retriever import Retriever

retriever = Retriever()

results = retriever.search(
    " Can I take a leave on the basis of medical certificate? "
)

for i, result in enumerate(results):

    print("=" * 80)

    print(f"Result {i+1}")

    print()

    print("Score:", result["score"])

    print()

    print(result["text"][:700])