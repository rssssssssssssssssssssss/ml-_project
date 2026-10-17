from fastapi import FastAPI
from pydantic import BaseModel

from rag.retriever import Retriever

app = FastAPI()

print("Loading Retriever...")
retriever = Retriever()
print("Retriever Loaded!")


class QueryRequest(BaseModel):
    question: str


@app.post("/retrieve")
def retrieve(request: QueryRequest):

    results = retriever.search(request.question)

    context = [item["text"] for item in results]

    return {
        "success": True,
        "context": context
    }