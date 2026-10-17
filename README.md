# Vernacular Company Policy Chatbot

A Retrieval-Augmented Generation (RAG) based multilingual chatbot that answers company policy-related questions using local Large Language Models (LLMs). The system retrieves relevant information from company documents using semantic search and generates accurate responses using Ollama.

---

## Features

- RAG (Retrieval-Augmented Generation) pipeline
- Local LLM inference using Ollama (Qwen 2.5:7B)
- FastAPI-based persistent retrieval service
- FAISS vector database for semantic search
- Sentence Transformers (BAAI/bge-m3) for embeddings
- Conversation memory support
- Multilingual question answering
- React frontend with responsive chat interface
- Express.js backend API
- Completely local execution (except initial model downloads)

---

## Tech Stack

### Frontend

- React
- Vite
- Axios
- CSS

### Backend

- Node.js
- Express.js
- Ollama
- Axios

### Retrieval Service

- FastAPI
- FAISS
- Sentence Transformers
- BAAI/bge-m3

### Language Model

- Qwen2.5:7B (Ollama)

---

## Project Architecture

```
                    User
                     │
                     ▼
            React Frontend
                     │
                     ▼
             Express Backend
                     │
      ┌──────────────┴──────────────┐
      │                             │
      ▼                             ▼
 FastAPI RAG Service          Ollama (Qwen2.5)
      │
      ▼
 Sentence Transformer (bge-m3)
      │
      ▼
   FAISS Vector DB
      │
      ▼
 Company Documents
```

---

## How It Works

### 1. Document Processing

- Company policy PDFs are loaded.
- Documents are split into semantic chunks.
- Each chunk is converted into embeddings using **BAAI/bge-m3**.
- Embeddings are stored inside a FAISS vector database.

This is a one-time process.

---

### 2. User Query

When a user asks a question:

1. React sends the query to Express.
2. Express forwards the query to the FastAPI retrieval service.
3. FastAPI generates the query embedding.
4. FAISS retrieves the most relevant document chunks.
5. Retrieved chunks are returned to Express.
6. Express builds the prompt.
7. Ollama (Qwen2.5:7B) generates the final answer.
8. Response is sent back to the frontend.

---

## Retrieval Pipeline

```
User Question
      │
      ▼
Sentence Transformer (bge-m3)
      │
      ▼
Vector Embedding
      │
      ▼
FAISS Search
      │
      ▼
Top Relevant Chunks
      │
      ▼
Qwen2.5 Prompt
      │
      ▼
Final Response
```

---

## Why FastAPI?

Initially, the backend launched a new Python process for every query.

```
Node
 │
 ▼
execFile()
 │
 ▼
Python
 │
 ▼
Load Model
 │
 ▼
Retrieve
```

This caused the embedding model to load for every request.

The project was optimized by introducing a persistent FastAPI service.

```
Node
 │
 ▼
HTTP Request
 │
 ▼
FastAPI
 │
 ▼
Retriever already loaded
 │
 ▼
Retrieve
```

Benefits:

- Embedding model loads only once.
- FAISS loads only once.
- Faster retrieval.
- Better scalability.
- Cleaner architecture.

---

## Performance Optimization

### Before Optimization

- Python started for every request.
- Embedding model loaded repeatedly.
- Higher retrieval latency.

### After Optimization

- Persistent FastAPI service.
- Cached embedding model.
- Cached FAISS index.
- Retrieval latency reduced to under one second.

---

## Models Used

### Embedding Model

**BAAI/bge-m3**

Purpose:

- Convert document chunks into dense vector embeddings.
- Convert user questions into embeddings.
- Enable semantic similarity search.

### Language Model

**Qwen2.5:7B**

Purpose:

- Read retrieved context.
- Generate natural language answers.
- Support multilingual conversations.

---

## Running the Project

### Clone Repository

```bash
git clone https://github.com/Chakri745/Vernacular_chatbot.git
cd Vernacular_chatbot
```

---

### Install Frontend

```bash
cd frontend
npm install
```

Run

```bash
npm run dev
```

---

### Install Backend

```bash
cd backend
npm install
```

---

### Install Python Dependencies

```bash
pip install -r requirements.txt
```

or

```bash
pip install fastapi uvicorn sentence-transformers faiss-cpu pypdf
```

---

### Start FastAPI Retrieval Server

```bash
cd backend

python -m uvicorn rag.server:app --reload
```

Runs on

```
http://127.0.0.1:8000
```

---

### Start Express Backend

```bash
cd backend

npm run dev
```

Runs on

```
http://localhost:5000
```

---

### Start Ollama

```bash
ollama serve
```

Run the model

```bash
ollama run qwen2.5:7b
```

---

## Authors

**A.S. Chakradhar**

Computer Science and Engineering

Amrita Vishwa Vidyapeetham

---