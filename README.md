# Retrivis.AI — Client

> The frontend interface for the Retrivis platform — a multimodal RAG application with configurable retrieval, agentic generation, and real-time document processing visibility.

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat)](https://clerk.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://retrivis-ai-client.vercel.app)

---

## 📌 Overview

**Retrivis.AI-Client** is the frontend of the Retrivis.Ai platform, built with Next.js. It connects to the [RetrIVis backend](https://github.com/jawahar-singamsetty/retrivis.ai-server) and provides a full interface for document ingestion, retrieval configuration, and AI-powered querying — with visibility into every stage of the RAG pipeline.

---

## ✨ Features

- 💬 **Chat / Query Interface** — Send queries and receive grounded answers streamed from GPT-4o
- 📂 **Document Upload UI** — Upload PDFs, images, and text files for ingestion into the vector store
- 🔍 **Retrieval Mode Selector** — Switch between Vector Search, Hybrid Search, Multi-Query Vector, and Multi-Query Hybrid per query
- ⚙️ **Retrieval Parameters** — Configure top-k chunk count and other retrieval settings
- ⚖️ **Vector Weights** — Tune the balance between dense vector and sparse keyword scores in hybrid retrieval
- 🤖 **Agentic RAG Toggle** — Switch between Simple RAG (direct retrieval) and Agentic RAG (supervisor agent with web search + RAG tools)
- 🔄 **Document Processing Stages** — Real-time visibility into each stage of the ingestion pipeline (uploading → queing → partitioning → chunking → AI summarisation → vectorization and storage)
- 🧩 **Final Chunks Viewer** — Inspect the actual chunks stored in the vector DB after ingestion completes
- 🔐 **Clerk Authentication** — Secure login and signup with Clerk

---

## 🚀 Live Demo

🔗 [retrivis-ai-client.vercel.app](https://retrivis-ai-client.vercel.app)

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Auth** | Clerk |
| **Deployment** | Vercel |
| **Backend** | [RetrIVis.AI Server](https://github.com/jawahar-singamsetty/retrivis.ai-server) |

---

## 🛠️ Setup

<details>
<summary><strong>Prerequisites</strong></summary>

<br>

- Node.js 18+
- A running instance of the [RetrIVis backend](https://github.com/jawahar-singamsetty/retrivis.ai-server)
- Clerk account for authentication

</details>

<details>
<summary><strong>Installation</strong></summary>

<br>

**1. Clone the repo**
```bash
git clone https://github.com/jawahar-singamsetty/retrivis.ai-client.git
cd retrivis.ai-client
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment**
```bash
cp .env.example .env.local
# Fill in your keys (see Environment Variables below)
```

**4. Start the development server**
```bash
npm run dev
```

App runs at `http://localhost:3000`

</details>

<details>
<summary><strong>Environment Variables</strong></summary>

<br>

| Variable | Description | How to get it |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key for frontend auth | [clerk.com](https://clerk.com) → Your App → API Keys → Publishable Key |
| `CLERK_SECRET_KEY` | Clerk secret key for server-side auth | [clerk.com](https://clerk.com) → Your App → API Keys → Secret Key |
| `NEXT_PUBLIC_API_URL` | URL of the RetrIVis backend | Local: `http://localhost:8000`, Prod: your deployed server URL |

</details>

---

## 🙏 Acknowledgements

Built and maintained by Jawahar Singamsetty.
Open to AI Engineer roles — feel free to reach out via [LinkedIn](https://www.linkedin.com/in/jawaharsr)

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/jawahar-singamsetty">Jawahar Singamsetty</a>
</p>
