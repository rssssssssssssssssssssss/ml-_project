import sys
import json
import sys

sys.stdout.reconfigure(encoding="utf-8")

from rag.retriever import Retriever

retriever = Retriever()

if len(sys.argv) < 2:
    print(json.dumps({
        "success": False,
        "error": "Question not provided."
    }))
    sys.exit(1)

question = " ".join(sys.argv[1:])

results = retriever.search(question, top_k=5)

context = [result["text"] for result in results]

print(json.dumps({
    "success": True,
    "context": context
}, ensure_ascii=False))