# ChainSight AI - Enterprise Control Tower

ChainSight AI is an autonomous supply chain control tower designed for C-suite executives. It combines live telemetry, exception tracking, and explainable AI actions to provide clear operational control across supply chain lanes.

## Architecture Diagram

```mermaid
graph TD
    subgraph Frontend [React Frontend (Vite)]
        UI[Dashboard UI]
        Chat[Copilot Chat Panel]
        Timeline[Execution Timeline]
    end

    subgraph Backend [Flask Backend]
        API[Flask REST API]
        Copilot[Copilot Service]
        RAG[RAG Engine]
        Agent[Langchain Agent]
    end

    subgraph External [External Services]
        LLM[Groq LLaMA-3.3-70b]
        DB[(ChromaDB Vector Store)]
    end

    UI --> API
    Chat --> API
    Timeline --> API
    
    API --> Copilot
    API --> RAG
    API --> Agent

    Copilot --> LLM
    RAG --> DB
    Agent --> LLM
    Agent --> RAG
```

## Running the Application

### Backend
1. Navigate to the `backend` directory.
2. Install dependencies: `pip install -r requirements.txt`
3. Start the server: `python app.py`

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

## Demo Mode

If a `GROQ_API_KEY` is not provided in the backend `.env` file, the application will gracefully fall back to Demo Mode. In this mode, mock data and simulated AI responses are used to demonstrate the functionality of the system.
