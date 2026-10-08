# Full Step-by-Step Guide: AI Interview Coach with Gemini

This document details all the steps from the official project PDF manual.

---

## 🎯 Objective
Create a full-stack AI Interview Coach web app that:
1. Generates realistic, tailored interview questions based on profession and difficulty.
2. Evaluates candidate answers using Google Gemini structured outputs.
3. Provides a detailed coaching report with 4 metrics (1–10 score), strengths, improvements, and an enhanced rewrite.
4. Stores recent attempt history and calculates average scores in the current browser tab.
5. Features a modern glassmorphic UI with persistent dark/light theme.

---

## 🛠️ Step 1 to Step 6: Environment Setup
1. **Install Visual Studio Code**: Download from [code.visualstudio.com](https://code.visualstudio.com/).
2. **Create Project Folder**: Create a folder named `ai-interview-coach` (or your chosen workspace name).
3. **Open VS Code**: Open the folder using `File` -> `Open Folder...`.
4. **Download Python**: Ensure Python 3.10+ is installed from [python.org](https://python.org). Make sure **"Add to PATH"** was checked during installation.

---

## 💻 Step 7 to Step 10: Virtual Environment (.venv)
In the VS Code PowerShell terminal:

```powershell
# Step 8: Create virtual environment
python -m venv .venv

# Step 9: Set execution policy for CurrentUser
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Step 10: Activate virtual environment
.\.venv\Scripts\Activate.ps1
```

---

## 📦 Step 11: Install Dependencies
Create `requirements.txt`:
```txt
Flask==3.1.3
google-genai==2.28.0
```

Install into the active `.venv`:
```powershell
python -m pip install -r requirements.txt
```

---

## 🔑 Step 12: Gemini API Key Setup
1. Get an API key from [Google AI Studio](https://aistudio.google.com/apikey).
2. Set it in PowerShell:
   ```powershell
   $Env:GEMINI_API_KEY = "your-actual-api-key-here"
   ```
3. Test if variable is active:
   ```powershell
   Test-Path Env:GEMINI_API_KEY
   ```
   *(Must return `True`)*

*Note: You can also place `GEMINI_API_KEY=your_key` in a `.env` file.*

---

## 🚀 Step 13 to Step 14: Minimal Server Test
Create `app.py`:
```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")
```

Run server:
```powershell
flask --app app.py run --debug
```
Open [http://127.0.0.1:5000/](http://127.0.0.1:5000/) in your browser.

---

## 🎨 Step 15+: Complete UI & Logic Implementation

### 1. Template (`templates/index.html`)
Contains:
- Topbar with dark/light mode toggle.
- Session summary counter (Attempts & Average Score).
- Workspace panel (Profession & Difficulty selector).
- Question generator card and answer input area.
- Structured coaching report (Score meters, strengths, improvements, stronger answer).
- Tab practice history list.

### 2. Styling (`static/style.css`)
- Glassmorphic surfaces with `backdrop-filter: blur(18px)`.
- Ambient floating orbs with keyframe animations.
- Dynamic responsive layout (grid/flex).
- Dark and light theme CSS custom property color schemes.

### 3. Frontend Logic (`static/app.js`)
- `sessionStorage` management for tab history.
- `localStorage` management for theme choice.
- Asynchronous API calls to `/api/question` and `/api/evaluate`.
- Dynamic score bar rendering and feedback display.

### 4. Gemini Backend (`app.py`)
- **JSON Schemas**:
  - `QUESTION_SCHEMA`: Returns `{"question": "...", "category": "Technical|Behavioral|Situational"}`
  - `EVALUATION_SCHEMA`: Returns `{"scores": {...}, "strengths": [...], "improvements": [...], "summary": "...", "improved_answer": "..."}`
- **Endpoints**:
  - `POST /api/question`: Validates input and prompts Gemini for role-specific questions.
  - `POST /api/evaluate`: Analyzes candidate's answer and returns structured coaching scores and actionable feedback.

---

## 🔍 Troubleshooting

| Issue | Solution |
|---|---|
| `Question generation failed...` | Verify your API key using `Test-Path Env:GEMINI_API_KEY` or check `.env`. |
| Script execution disabled | Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`. |
| Port 5000 already in use | Run on an alternative port: `flask --app app.py run --port 5001 --debug`. |
