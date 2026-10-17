# Vernacular Company Policy & Banking Chatbot

A Retrieval-Augmented Generation (RAG) multilingual AI assistant that answers organization and banking-related questions (e.g., **Vedranta Bank** policies, accounts, loans, and customer service) using local Large Language Models (LLMs) and local Speech-to-Text (STT).

The system retrieves context from company documents using semantic search (**FAISS** + **BAAI/bge-m3**), supports multilingual voice queries with **OpenAI Whisper STT**, and generates grounded answers using local **Ollama (Qwen 2.5:7B)**.

---

## Key Features

- **RAG Pipeline**: Semantic search over organizational documents via FAISS vector database.
- **Local Speech-to-Text (STT)**: Direct in-browser microphone recording with **`openai/whisper-small`** running locally on GPU/CPU for English and native Indian languages (Telugu, Hindi, Tamil, Kannada, Malayalam, etc.).
- **Local LLM Inference**: Privacy-friendly inference using **Ollama (Qwen 2.5:7B)**.
- **Multilingual Support**: Text and voice queries in regional languages with automatic language-matched responses.
- **Persistent Retrieval Service**: FastAPI server caching the embedding model, vector index, and STT pipeline.
- **Modern Responsive Frontend**: React + Vite + Tailwind CSS interface with chat memory and language selection.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons, Axios |
| **Backend API** | Node.js, Express.js, Multer |
| **RAG & STT Service** | Python 3.12, FastAPI, Uvicorn, FAISS, PyTorch, Hugging Face Transformers |
| **Embedding Model** | `BAAI/bge-m3` |
| **Speech-to-Text Model** | `openai/whisper-small` |
| **Language Model** | `qwen2.5:7b` via Ollama |

---

## Project Architecture

```
                    User (Text or Voice)
                             │
                             ▼
                    React Frontend (Vite)
                             │
              ┌──────────────┴──────────────┐
       (Text Queries)                (Voice Audio WAV)
              │                             │
              ▼                             ▼
       Express Backend (:5000)      Express Backend (:5000)
              │                             │
              │                             ▼
              │                    FastAPI /transcribe (:8000)
              │                    (Whisper STT on GPU/CPU)
              │                             │
              │ (Transcribed Text) ◄────────┘
              ▼
       FastAPI /retrieve (:8000)
       (BAAI/bge-m3 + FAISS)
              │
              ▼ (Top Relevant Document Chunks)
       Ollama (:11434)
       (Qwen2.5:7B Prompt Synthesis)
              │
              ▼
       Response sent back to React UI
```

---

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js (v18+) & npm**: [https://nodejs.org/](https://nodejs.org/)
- **Python (3.10 to 3.12)**: [https://www.python.org/](https://www.python.org/)
- **Ollama**: [https://ollama.com/](https://ollama.com/)
- **Git**: [https://git-scm.com/](https://git-scm.com/)

---

## Initial Setup (One-time only)

### 1. Install Python Dependencies & Offline Embedding Model
```bash
# From the project root
pip install -r requirements.txt

# Download and cache BGE-M3 model locally
cd backend
python save_model.py
cd ..
```

### 2. Download the Ollama LLM
Make sure Ollama is running (`ollama serve`), then pull the model:
```bash
ollama pull qwen2.5:7b
```

### 3. Install Node.js Backend & Frontend Dependencies
```bash
# Backend dependencies
cd backend
npm install
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..
```

---

## How to Start the Application (Step-by-Step)

To run the full stack, you need to start **Ollama**, the **FastAPI RAG/STT service**, the **Express API gateway**, and the **Vite React UI**.

Open separate terminal windows for each service:

### Step 1: Start Ollama (LLM Engine)
```powershell
ollama serve
```
> Starts the local LLM server at `http://localhost:11434`.

---

### Step 2: Start the FastAPI Service (RAG + Whisper STT)
In a new terminal:
```powershell
cd backend
python -m uvicorn rag.server:app --port 8000
```
> Runs at `http://127.0.0.1:8000`. On first start, it loads `BAAI/bge-m3` and `openai/whisper-small` into GPU/CPU memory.

---

### Step 3: Start the Express Backend API
In a new terminal:
```powershell
cd backend
npm run dev
```
> Runs at `http://localhost:5000`. Acts as the central orchestrator routing requests to FastAPI and Ollama.

---

### Step 4: Start the Frontend UI
In a new terminal:
```powershell
cd frontend
npm run d
```
> Opens the client application at `http://localhost:5173/`.

---

## Using the Chatbot

1. Open **`http://localhost:5173/`** in your browser.
2. **Text Query**: Type questions about bank accounts, loans, branch details, or policies in English, Telugu, Hindi, Tamil, Kannada, or Malayalam.
3. **Voice Query**:
   - Select your language in the dropdown (e.g. *Telugu*, *Hindi*, *Tamil*, or *English*).
   - Click the **Microphone** button to speak.
   - Click the red **Stop** button when done.
   - Whisper transcribes your voice automatically, retrieves policy context, and prompts Qwen to respond in the selected language.

---

## How to Stop All Models and the Application

When you are done using the application, follow these steps to stop all running processes, release your CPU/GPU, and free up system memory:

### 1. Stop Frontends & Servers
In each open terminal window, press:
```
Ctrl + C
```
Terminate Terminal 1 (Ollama), Terminal 2 (FastAPI), Terminal 3 (Express), and Terminal 4 (Vite Frontend).

---

### 2. Force Stop Background Ollama Daemon & App
If Ollama was launched as a Windows background tray app or background daemon, terminate it using PowerShell:

```powershell
taskkill /F /IM ollama.exe /T
taskkill /F /IM "ollama app.exe" /T
```

---

### 3. Stop Any Lingering Python / Uvicorn Processes
If the Whisper or FastAPI python process remains active in the background:

```powershell
# In PowerShell:
Stop-Process -Name python, py -Force -ErrorAction SilentlyContinue
```
*(Or use `taskkill /F /IM python.exe /T`)*

---

### 4. Verify That All Models & Background Tasks Are Stopped
Check if any Ollama, Whisper, or Python model processes are still consuming memory:

```powershell
Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -match "ollama|python|uvicorn" }
```
If the command outputs nothing (or only your IDE's language server), all model processes and servers are completely halted and your system resources are fully cleared.

---

## Project Structure

```
ml-_project/
├── backend/
│   ├── models/
│   │   └── bge-m3/                 # Cached offline BGE-M3 embeddings
│   ├── rag/
│   │   ├── server.py               # FastAPI persistent service (:8000)
│   │   ├── stt_service.py          # Whisper STT multilingual pipeline
│   │   ├── retriever.py            # FAISS similarity search
│   │   ├── embedding_service.py    # Document & query embedding generator
│   │   ├── loader.py               # Document PDF parser
│   │   ├── chunker.py              # Semantic text chunking
│   │   ├── vector_store.py         # FAISS index persistence
│   │   └── ingest.py               # Document ingestion CLI
│   ├── src/
│   │   ├── controllers/            # Express chat & transcribe controllers
│   │   ├── routes/                 # Express API routes (/api/chat)
│   │   ├── services/
│   │   │   ├── llm/qwen.service.js # Ollama prompt builder & client
│   │   │   ├── memory/             # Conversation history memory
│   │   │   └── rag/                # HTTP client for FastAPI service
│   │   ├── app.js                  # Express application setup
│   │   └── server.js               # Express server entry point (:5000)
│   ├── save_model.py               # Helper script to download bge-m3
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBox.jsx         # Chat messages view & welcome state
│   │   │   ├── InputBar.jsx        # Text input & Web Audio mic recording
│   │   │   ├── Message.jsx         # Chat message bubble
│   │   │   └── Navbar.jsx          # Header with Vedranta Bank branding
│   │   ├── pages/Home.jsx          # Main chat interface page
│   │   ├── services/api.js         # Axios API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── knowledge/
│   └── organizations/
│       └── sample_company/
│           ├── documents/          # 11 active Vedranta Bank policy PDFs
│           └── vectordb/           # Saved FAISS index & metadata JSON
│
├── requirements.txt                # Python dependencies
└── README.md
```

---

## Authors

**A.S. Chakradhar**  
Computer Science and Engineering  
Amrita Vishwa Vidyapeetham