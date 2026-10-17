from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from rag.retriever import Retriever
from rag.stt_service import WhisperSTTService

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading Retriever...")
retriever = Retriever()
print("Retriever Loaded!")

print("Loading Whisper STT...")
stt_service = WhisperSTTService()
print("Whisper STT Loaded!")


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


@app.post("/transcribe")
async def transcribe(
    file: UploadFile = File(...),
    language: Optional[str] = Form(None)
):
    try:
        audio_bytes = await file.read()
        if not audio_bytes:
            raise HTTPException(status_code=400, detail="Empty audio file")

        result = stt_service.transcribe(audio_bytes, language=language)
        return result
    except Exception as e:
        print(f"Transcription error: {e}")
        return {
            "success": False,
            "error": str(e),
            "text": ""
        }