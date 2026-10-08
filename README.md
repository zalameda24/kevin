# AI Interview Coach with Gemini

An interview practice application built with Flask, Google Gemini AI (`gemini-2.5-flash`), and a glassmorphic dashboard interface.

---

## Features

- **Tailored Practice:** Select a profession (Software Engineer, Data Analyst, Product Manager, Cybersecurity Analyst, Cloud Engineer) and difficulty (Easy, Standard, Advanced).
- **Structured Coaching Report:** Evaluates your answers on 4 key metrics (Communication, Confidence, Technical Depth, Problem Solving) with score bars (1-10), strengths, areas for improvement, and a rewritten stronger response.
- **Session History & Analytics:** Tracks total practice attempts and computes overall average score.
- **Persistent Light / Dark Theme:** Glassmorphic UI with saved theme preferences.

---

## Setup and Running Guide

### Step 1: Open Project in VS Code
Open the project directory in Visual Studio Code (`File` > `Open Folder...`).

### Step 2: Open PowerShell Terminal
In VS Code, press `Ctrl + ~` or navigate to **Terminal > New Terminal**.

### Step 3: Create and Activate Virtual Environment
```powershell
python -m venv .venv
```

Allow script execution (if not yet enabled):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Activate the virtual environment:
```powershell
.\.venv\Scripts\Activate.ps1
```

### Step 4: Install Dependencies
```powershell
python -m pip install -r requirements.txt
```

### Step 5: Set up Gemini API Key
1. Obtain an API key from Google AI Studio (https://aistudio.google.com/apikey).
2. Set it in your PowerShell session:
   ```powershell
   $Env:GEMINI_API_KEY = "your-actual-api-key-here"
   ```
   *(Alternatively, create a `.env` file containing `GEMINI_API_KEY=your-actual-api-key-here`).*
3. Verify that the variable exists:
   ```powershell
   Test-Path Env:GEMINI_API_KEY
   ```

### Step 6: Start the Development Server
```powershell
flask --app app.py run --debug
```

### Step 7: Access the Application
Open your web browser and navigate to:
http://127.0.0.1:5000

---

## Project Structure

```
├── .venv/                      # Python virtual environment (ignored in git)
├── .env                        # Local secrets & API key (ignored in git)
├── .gitignore                  # Git ignore rules
├── requirements.txt            # Pinned dependencies (Flask==3.1.3, google-genai==2.28.0)
├── app.py                      # Flask backend and Gemini API integration
├── docs/
│   └── STEP_BY_STEP_GUIDE.md   # Complete step-by-step manual from PDF
├── templates/
│   └── index.html              # Frontend HTML structure
└── static/
    ├── style.css               # Design system and responsive layout
    └── app.js                  # Frontend state management & API communication
```
