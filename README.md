# 🤖 AI Scrum Assistant
*A Multi-Agent, AI-Powered Scrum Companion for Jira*

> A full-stack, agentic AI system that automates backlog refinement, PRD parsing, and sprint planning — built with Node.js, LangChain.js, Google Gemini, Jira API, and a React-based Human-in-the-Loop (HITL) dashboard.

---

## 🧭 Overview

The **AI Scrum Assistant** is a modern, agentic application designed to act as a *virtual Scrum Master* — simplifying Agile workflows by combining AI orchestration, Jira integration, and semantic intelligence.

Built for MERN developers exploring next-gen AI orchestration, this assistant:

- Converts **Product Requirement Documents (PRDs)** into actionable Jira stories.  
- Analyzes existing **backlogs and sprints** to suggest improvements.  
- Plans **data-driven sprints** based on historical velocity.  
- Uses **semantic search (RAG)** to detect duplicates and refine backlog quality.  
- Presents results in a **React + Shadcn/ui dashboard** where humans approve or reject AI suggestions.

**Status:** The project structure has been set up, but the implementation of the features is not yet complete. The files are currently empty placeholders.

---

## ⚙️ Core Architecture

The system follows a **Multi-Agent (Compound AI)** architecture — with an *Orchestrator backend* managing specialized agents/tools.

### 🔧 Components

| Component | Description |
|------------|-------------|
| **React + Vite Frontend** | Human-in-the-Loop dashboard for reviewing AI output and approving Jira actions. |
| **Node.js + Express Backend** | Orchestration layer coordinating AI services, Jira APIs, and vector DB. |
| **LangChain.js Orchestration** | Core AI framework managing LLM prompts, chains, and structured outputs. |
| **Google Gemini API** | Primary LLM used for reasoning, text parsing, and sprint analysis. |
| **Jira REST API (jira.js)** | Integration for reading/writing tickets, velocity, and backlog data. |
| **Chroma Vector DB** | Used for semantic duplicate detection (RAG search). |

---

## 🧩 Tech Stack

| Layer | Technology | Purpose |
|--------|-------------|----------|
| Backend | **Node.js + Express (ESM)** | Non-blocking orchestrator for AI + API workflows |
| AI Layer | **LangChain.js + Zod** | Structured JSON output and multi-step orchestration |
| LLM Provider | **Google Gemini 1.5 Pro** | Tool-calling for PRD → Ticket parsing |
| Database | **Chroma (via LangChain)** | Vector embeddings for semantic duplicate detection |
| Frontend | **React + Vite + Shadcn/ui + React Query (TanStack)** | Modern HITL dashboard |
| Integration | **jira.js (Version3Client)** | Simplified Jira REST API access |

---

## 🔐 Authentication Setup

The system uses **API Token + Basic Auth** (recommended by Atlassian for personal/team tools).

1. Generate a token at  
   👉 [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Copy your Jira site name (`https://YOUR_ORG.atlassian.net`)
3. Add credentials to `.env`:
   ```
   JIRA_EMAIL=your_email@domain.com
   JIRA_API_TOKEN=your_api_token
   JIRA_HOST=https://yourorg.atlassian.net
   GOOGLE_API_KEY=your_google_gemini_key
   ```

---

## 🚀 Installation & Setup

**Note:** The project is not yet implemented. The following are the planned installation steps.

```
# 1. Clone the repository
git clone https://github.com/<your-username>/ai-scrum-assistant.git
cd ai-scrum-assistant

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Run the system (two terminals)
npm run dev          # frontend (Vite)
npm run server       # backend (Express)
```

---

## 🧠 Key Features

1️⃣ **PRD → Jira Ticket Generation**
- Upload PRD → AI converts to structured Jira stories using Gemini + LangChain.
- Validated against a **Zod schema**.

2️⃣ **AI-Powered Backlog Refinement**
- Detects **duplicates** with semantic RAG search.
- Finds **missing ACs** or **split suggestions**.

3️⃣ **Data-Driven Sprint Planning**
- Calculates **velocity & spillover** using Jira API.
- Suggests realistic sprint backlog.

4️⃣ **Human-in-the-Loop Dashboard**
- Built with **React + Shadcn/ui + React Query**.
- Approve or reject tickets, automatically sync to Jira.

---

## 🧱 Project Structure

```
ai-scrum-assistant/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── index.js
│   │   └── server.js
│   ├── vector_store/
│   ├── .gitignore
│   ├── package-lock.json
│   └── package.json
│
├── scripts/
│   └── index_jira_tickets.js
│
└── README.md
```

---

## 🧩 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/v1/tickets/analyze-prd` | Analyze PRD text and suggest Jira stories |
| POST | `/api/v1/tickets/approve` | Approve suggestion and create Jira issue |
| GET | `/api/v1/backlog/refine` | Fetch duplicate & improvement suggestions |
| GET | `/api/v1/planning/sprint` | Generate AI-driven sprint plan |

---

## 🧰 Development Notes

- Use **React Query** for server-state (avoid useState/Redux).  
- Store all credentials in `.env`.  
- Test modularly — AI logic and Jira logic are decoupled.  
- Enforce **structured outputs** with LangChain `withStructuredOutput()` + Zod.

---

## 🧭 Phase 2 Roadmap

| Feature | Status | Planned Enhancements |
|----------|---------|----------------------|
| Slack & GitHub integration | ⏳ Planned | For multi-tool orchestration |
| Sprint retrospective summarization | ⏳ Planned | AI summarizer for sprint data |
| OAuth 2.0 Auth | ⏳ Future | Replace API token with OAuth |
| Multi-agent orchestration | ⏳ Planned | Extend AI Orchestrator layer |

---

## 📚 References

Based on:  
**"A Pragmatic Technical Blueprint for the AI Scrum Assistant (2025)"**

---

## 💡 Author & License

**Author:** [Your Name]  
**License:** MIT  
**Contact:** [your.email@example.com]