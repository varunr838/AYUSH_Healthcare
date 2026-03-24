# AYUSH Sentinel - Health System

An intelligent, full-stack application that bridges the ancient wisdom of traditional healing (Ayurveda, Siddha) with predictive artificial intelligence. The system features a React-based frontend and a FastAPI backend with RAG (Retrieval-Augmented Generation) capabilities to analyse patient symptoms and medical documents.

## Project Structure

- `ayush_frontend/`: A Vite + React application providing the modern UI patient portal and AYUSH AI Chat interface.
- `ayush_rag_backend/`: A FastAPI Python server handling document ingestion, RAG processing via ChromaDB, and integration with the Groq Llama 3 LLM.

## Prerequisites

- **Node.js** (v18+ recommended)
- **Python** (v3.10+ recommended)
- **Groq API Key**: You must have a Groq API key configured in a `.env` file within the backend directory.

---

## 🚀 Setup & Installation Guide

### 1. Backend Setup (FastAPI + RAG)

Open a terminal and navigate to the backend directory:
```bash
cd ayush_rag_backend
```

**Step 1.1: Create & Activate a Virtual Environment**
(If the `.venv` directory already exists, you can skip creation and just activate it.)

*On Windows:*
```bash
python -m venv .venv
.venv\Scripts\activate
```
*On macOS/Linux:*
```bash
python3 -m venv .venv
source .venv/bin/activate
```

**Step 1.2: Install Python Dependencies**
```bash
pip install -r requirements.txt
```

**Step 1.3: Configure the Knowledge Base (One-Time Setup)**
Ensure your traditional healing PDFs are placed in `ayush_rag_backend/data/guidelines/`. Then, start the backend and run the ingestion command to build the local ChromaDB vector database.

Start the backend:
```bash
python -m uvicorn main:app --reload --port 8000
```

In a **separate terminal**, trigger the ingestion:
```bash
# Using cURL
curl -X POST http://127.0.0.1:8000/ingest_guidelines
```

*(Leave the backend server running.)*

---

### 2. Frontend Setup (React + Vite)

Open a **new terminal** and navigate to the frontend directory:

```bash
cd ayush_frontend
```

**Step 2.1: Install Node Dependencies**
```bash
npm install
```

**Step 2.2: Start the Development Server**
```bash
npm run dev
```

---

## 🩺 Usage Instructions

1.  Open your web browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).
2.  Click on the **AYUSH AI Chat** button located in the top navigation bar to open the AI portal.
3.  **Interact with the AI**:
    *   **Text Query**: Describe your symptoms in the text box at the bottom (e.g., "I have a high fever and joint pain").
    *   **File Upload**: Click the paperclip icon to optionally upload a PDF of your medical reports.
4.  **Send**: Click the send icon. The FastAPI backend will analyze your input, cross-reference it with the ingested AYUSH guidelines, and dynamically stream back a structured, personalized healing protocol, complete with warnings and cited sources.
