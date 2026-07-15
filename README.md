# Vernacular SCADA Industrial RAG Copilot

An immersive, AI-powered Retrieval-Augmented Generation (RAG) assistant designed for querying industrial safety guides, standard operating procedures (SOPs), and operational manuals in local Indic languages (**Hindi, Tamil, Telugu, Kannada, and English**). 

The application features a high-fidelity **SCADA console HUD welcome screen** and real-time visualization of the RAG pipeline steps.

---

## Key Features

1. **SCADA Dashboard Animations**:
   - **Gears Blueprint Canvas**: Parallax stenciled gear blueprint rotations drifting in the background.
   - **Vapor/Steam Particle Emitters**: Orange safety steam rising continuously from the footer.
   - **Coolant Oscilloscope & Dial Pressure Gauges**: Vibrating dial needles and live sinus-wave plotters displaying diagnostic telemetry.
   - **Pneumatic Steel Shutters**: Transition doors bounded by caution hazard stripes that slam shut to swap pages.
   
2. **Clean-Slate PDF Ingestion**:
   - Zero hardcoded fallback datasets. The chatbot retrieves context *exclusively* from your uploaded PDFs.
   - Handles massive files (up to 200MB) with customized progress and error-catching boundaries.

3. **Multi-Tier Translation Pipeline**:
   - Integrates the high-precision **AI4Bharat IndicTrans2** neural model locally.
   - Falls back gracefully to a public **Google Translate API** micro-tunnel if the neural server is offline, ensuring translation always works.

4. **RAG Pipeline Analyzer**:
   - Real-time stepper tracking query translations, semantic keyword scanning, document chunk retrievals, and prompt structure generation.

---

## System Architecture

```
   ┌────────────────────────────────────────────────────────┐
   │                  React (Vite) Frontend                 │
   │           (SCADA Animations & RAG Stepper)             │
   └───────────────────────────┬────────────────────────────┘
                               │ (REST API)
   ┌───────────────────────────▼────────────────────────────┐
   │                 Node.js Express Backend                │
   │            (Multer parser & Retrieval index)           │
   └───────────────┬───────────────────────────┬────────────┘
                   │ (Port 11434)              │ (Port 8000)
   ┌───────────────▼───────────────┐   ┌───────▼───────────────┐
   │       Ollama (Qwen2.5)        │   │    Python FastAPI     │
   │     (RAG Prompt Generator)    │   │  (IndicTrans2 Suite)  │
   └───────────────────────────────┘   └───────────────────────┘
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (V18+)
- [Python](https://www.python.org/) (V3.9+)
- [Ollama](https://ollama.com/) (Make sure to run `ollama pull qwen2.5:7b` to install the generator model)

---

### Step 1: Clone and Configure Project
1. Clone this repository to your local drive.
2. Ensure Ollama is running:
   ```bash
   ollama run qwen2.5:7b
   ```

---

### Step 2: Start the Express Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Node.js server:
   ```bash
   npm start
   ```
   *The backend will boot up on **`http://localhost:5000`**.*

---

### Step 3: Start the React Frontend Dashboard
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite server:
   ```bash
   npm run dev
   ```
   *Open **`http://localhost:5173/`** in your browser.*

---

### Step 4: Setup the Translation Microservice (Optional)
To run the high-precision **AI4Bharat IndicTrans2** translation model locally instead of the web fallback:
1. Navigate to the root directory:
   ```bash
   cd ..
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   ```
3. Install PyTorch and translation dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the microservice script:
   ```bash
   python backend/indictrans2_server.py
   ```
   *The translation microservice will run on **`http://127.0.0.1:8000`**.*
