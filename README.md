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

## Getting Started (Step-by-Step Setup for New Users)

Follow these steps to set up and run the entire project from scratch on your machine.

### Prerequisites

Ensure you have the following installed on your machine:
- **Git**: [https://git-scm.com/](https://git-scm.com/)
- **Node.js (v18+) & npm**: [https://nodejs.org/](https://nodejs.org/)
- **Python (3.10 to 3.12)**: [https://www.python.org/](https://www.python.org/)
- **Ollama**: [https://ollama.com/](https://ollama.com/)

---

### Step 1: Clone the Repository

Clone the project and checkout the `chakri` branch:

```bash
git clone https://github.com/rssssssssssssssssssssss/ml-_project.git
cd ml-_project
git checkout chakri
```

---

### Step 2: Install Python Dependencies & Download STT/Embedding Models

1. **Install Python packages**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Download & Save the Embedding Model (`bge-m3`)**:
   Run the model downloader script to cache the BGE-M3 model locally:
   ```bash
   cd backend
   python save_model.py
   cd ..
   ```

3. **(Optional) Build / Re-index Document Embeddings**:
   If you add or modify PDFs in `knowledge/organizations/sample_company/documents/`:
   ```bash
   cd backend/rag
   python ingest.py
   cd ../..
   ```

---

### Step 3: Set Up & Pull the Ollama LLM

1. Start the Ollama background daemon:
   ```bash
   ollama serve
   ```

2. Pull the language model in a separate terminal:
   ```bash
   ollama pull qwen2.5:7b
   ```

---

### Step 4: Install Node.js Backend Dependencies

```bash
cd backend
npm install
```

Create or verify `backend/.env`:
```env
PORT=5000
OLLAMA_MODEL=qwen2.5:7b
OLLAMA_HOST=http://localhost:11434
```
Return to root:
```bash
cd ..
```

---

### Step 5: Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

---

## Running the Application

Open 3 separate terminals (or terminal tabs) to run the services:

### Terminal 1: FastAPI RAG & Whisper STT Service
```bash
cd backend
python -m uvicorn rag.server:app --port 8000
```
> Runs at `http://127.0.0.1:8000`. On first launch, Whisper STT will automatically load its weights into GPU/CPU memory.

---

### Terminal 2: Express Backend Server
```bash
cd backend
npm run dev
```
> Runs at `http://localhost:5000`.

---

### Terminal 3: Vite React Frontend
```bash
cd frontend
npm run d
```
> Opens in your browser at `http://localhost:5173/`.

---

## Using the Chatbot

1. Open **`http://localhost:5173/`** in your browser.
2. **Text Query**: Type your question in any language (e.g., *"Where is Vedranta Bank headquarters?"* or *"What is the home loan eligibility?"*).
3. **Voice Query**:
   - Choose your spoken language in the dropdown (e.g. **Telugu (తెలుగు)**, **Hindi (हिन्दी)**, **Tamil (தமிழ்)**, or **English**).
   - Click the **Microphone** button.
   - Speak your question into your microphone.
   - Click the red **Stop** button.
   - Whisper will automatically transcribe your speech and submit it to the chatbot.

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