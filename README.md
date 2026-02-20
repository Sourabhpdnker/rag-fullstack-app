# RAG-Based Local Chatbot System

A fully local **Retrieval-Augmented Generation (RAG)** chatbot system designed to understand and implement modern AI system architecture from first principles.

Author: **Saurabh Pednekar**

---

# 1. Project Overview

This project implements a complete **RAG pipeline** integrating:

- Document ingestion
- Text chunking
- Embedding generation
- Vector similarity search
- Context-aware LLM response generation
- Persistent chat storage

The system runs entirely on a local environment without relying on external cloud-based LLM APIs.

The objective of this project is to understand:

- Semantic embeddings and vector representations
- Similarity search in high-dimensional space
- LLM orchestration in backend systems
- End-to-end AI system architecture
- Full-stack AI application development

---

# 2. System Architecture

## High-Level Flow

Document Upload
→ Text Parsing
→ Chunking
→ Embedding Generation
→ Vector Storage
→ Query Embedding
→ Similarity Search (Top-K Retrieval)
→ Context Injection
→ LLM Generation
→ Response Delivery

---

## Architecture Components

### 2.1 Frontend Layer

- Handles user interaction
- Sends chat requests to backend
- Displays generated responses
- Supports document upload (future extension)

Communicates with backend via REST API.

---

### 2.2 Backend Layer (API Layer)

Built using FastAPI.

Responsibilities:

- API routing
- Request validation
- Chat history management
- Embedding orchestration
- Vector retrieval
- Prompt construction
- LLM invocation

Backend follows modular architecture:

- Routers
- Services
- Models
- Schemas
- Dependency injection for DB sessions

---

### 2.3 Relational Database

SQLite is used for:

- Chat history persistence
- Session management
- Metadata storage
- Message tracking

ORM: SQLAlchemy
Validation: Pydantic

---

### 2.4 Embedding Pipeline

Text is converted into dense vector representations.

Embeddings:

- High-dimensional floating-point vectors
- Capture semantic meaning
- Used for similarity comparison

Query embedding is generated at runtime and compared with stored document embeddings.

---

### 2.5 Vector Database Layer

Stores embeddings in vector space.

Performs:

- Cosine similarity search
- Top-k nearest neighbor retrieval
- Efficient semantic lookup

This enables retrieval of the most contextually relevant document chunks.

---

### 2.6 LLM Layer

Runtime: Ollama
Model: Mistral

Responsibilities:

- Receives augmented prompt
- Generates response conditioned on retrieved context
- Produces final answer grounded in external knowledge

Prompt structure:

System Instructions

- Retrieved Context
- User Query

This enforces grounded generation and reduces hallucination.

---

# 3. Technologies Used

## Frontend

- React
- Vite
- Tailwind CSS
- Axios (HTTP communication)

## Backend

- FastAPI
- Uvicorn
- Python 3.10+
- SQLAlchemy
- Pydantic
- Dependency Injection Pattern

## Database

- SQLite

## AI / RAG Stack

- Ollama (local LLM runtime)
- Mistral model
- Embedding model (local)
- Vector database (FAISS / Chroma or equivalent)
- Cosine similarity search
- Chunking strategy with token limits

## Development Environment

- Virtual Environment (venv)
- Node.js
- npm

---

# 4. Running the Project

---

## 4.1 Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- Ollama installed
- Mistral model pulled locally

To pull Mistral:

```
ollama pull mistral
```

---

# 5. Backend Setup

### Step 1 — Navigate to Backend Directory

```
cd backend
```

### Step 2 — Create Virtual Environment

```
python -m venv venv
```

### Step 3 — Activate Virtual Environment

Mac/Linux:

```
source venv/bin/activate
```

Windows:

```
venv\Scripts\activate
```

### Step 4 — Install Dependencies

```
pip install -r requirements.txt
```

### Step 5 — Run FastAPI Server

```
uvicorn main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

Swagger documentation:

```
http://127.0.0.1:8000/docs
```

---

# 6. Frontend Setup

### Step 1 — Navigate to Frontend Directory

```
cd frontend
```

### Step 2 — Install Dependencies

```
npm install
```

### Step 3 — Start Development Server

```
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 7. Running the Complete System

1. Start Ollama
2. Run backend server
3. Run frontend server
4. Open browser at frontend URL
5. Start chatting

System Flow:

React UI
→ FastAPI
→ SQLite (chat persistence)
→ Vector Search
→ Ollama (Mistral)
→ Response returned to UI

---

# 8. Future Improvements

- Streaming responses
- Token-level response handling
- Persistent vector storage
- Advanced chunking strategies
- Context window optimization
- Conversation memory management
- Production-ready deployment

---

# Author

**Saurabh Pednekar**
AI Engineering & Applied Machine Learning Enthusiast

---

This project demonstrates a full-stack, locally deployed, retrieval-augmented AI system engineered from scratch to understand modern AI infrastructure at a systems level.
