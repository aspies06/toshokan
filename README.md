# Toshokan LM

> A local-first desktop app for building, managing, and querying LLM knowledge bases from your own documents.

Toshokan LM is an Electron-based desktop application that combines a JavaScript/React UI with a Python pipeline for ingesting source documents, chunking them, generating embeddings, and storing everything in a local library (SQLite + vector store). All data stays on your machine.

## Features

- 📚 Ingest local documents into a structured library
- 🧩 Automatic document chunking and embedding
- 🔍 Vector similarity search (local vector DB)
- 🖥️ Cross-platform desktop UI (Electron + React)
- 🐍 Python pipeline orchestrated from Node
- 🔒 Local-first — no data leaves your machine

## Tech Stack

| Layer            | Technology                         |
| ---------------- | ---------------------------------- |
| Desktop shell    | Electron + Electron Forge + Vite   |
| UI               | React (JSX)                        |
| Pipeline         | Python 3                           |
| Chat server      | Python 3                           |
| Storage          | SQLite + local vector DB           |

## Project Structure

```
src/
├── main/        # Electron main process (Node.js)
├── ui/          # React UI (renderer)
├── pipeline/    # Python document pipeline
└── server/      # Python chat server
tests/           # Unit and functional tests
```

## Development Setup

### Prerequisites

- **Node.js** (latest stable, or via [nvm](https://github.com/nvm-sh/nvm))
- **Python 3.10+**
- **pip**

### 1. Install Node.js

**Option A — Standalone:**
Download the latest stable release for your OS from [nodejs.org](https://nodejs.org/en/download).

**Option B — nvm (recommended):**
```bash
nvm install lts        # or: nvm install latest
nvm use lts

# verify
node -v
npm -v
```

### 2. Install Node dependencies
```bash
npm install
```

### 3. Set up the Python environment
At the repo root, create and activate a virtual environment:
```bash
python -m venv .venv

# Mac / Linux
source .venv/bin/activate

# Windows (PowerShell)
.\.venv\Scripts\Activate.ps1
```

Install dependencies into the venv:
```bash
pip install -r requirements-dev.txt
```

> `requirements-dev.txt` includes the dev toolchain; runtime deps live in `requirements.txt` and are installed alongside.

### 4. Run the app
```bash
npm start
```

### 5. Package a distributable
```bash
npm run package   # local platform
npm run make      # installers for all platforms
```
## License

See [LICENSE](./LICENSE).

---
Built with ❤️ by [Aidan Spies](mailto:spiesaidan@gmail.com).