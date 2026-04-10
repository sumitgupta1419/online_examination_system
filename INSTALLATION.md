# 📥 INSTALLATION GUIDE

Complete step-by-step installation guide for the Online Examination System.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Clone Repository](#clone-repository)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [Verification](#verification)
7. [Common Issues](#common-issues)

---

## 1️⃣ Prerequisites

### Install Python 3.8+

**macOS:**
```bash
# Using Homebrew
brew install python@3.11

# Verify installation
python3 --version
```

**Windows:**
1. Download from https://www.python.org/downloads/
2. Run installer
3. ✅ Check "Add Python to PATH"
4. Click "Install Now"

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

### Install Node.js 16+

**macOS:**
```bash
# Using Homebrew
brew install node

# Verify installation
node --version
npm --version
```

**Windows:**
1. Download from https://nodejs.org/
2. Run installer
3. Accept defaults

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Install Git

**macOS:**
```bash
# Using Homebrew
brew install git
```

**Windows:**
Download from https://git-scm.com/download/win

**Linux:**
```bash
sudo apt install git
```

---

## 2️⃣ Clone Repository

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/online-exam-system.git

# Navigate to project directory
cd online-exam-system
```

---

## 3️⃣ Backend Setup

### Step 1: Navigate to Backend

```bash
cd backend
```

### Step 2: Create Virtual Environment

**macOS/Linux:**
```bash
python3 -m venv venv
```

**Windows:**
```bash
python -m venv venv
```

### Step 3: Activate Virtual Environment

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows (Command Prompt):**
```bash
venv\Scripts\activate.bat
```

**Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

✅ You should see `(venv)` at the start of your terminal prompt.

### Step 4: Upgrade pip

```bash
pip install --upgrade pip
```

### Step 5: Install Dependencies

```bash
pip install -r requirements.txt
```

**If you get pydantic-core errors on Mac:**
```bash
# Install Rust first
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Then install dependencies
pip install -r requirements.txt
```

### Step 6: Verify Backend Installation

```bash
python main.py
```

✅ **Success!** You should see:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Press `Ctrl + C` to stop for now.

---

## 4️⃣ Frontend Setup

### Step 1: Open New Terminal

Keep the backend terminal open, open a **NEW** terminal window.

### Step 2: Navigate to Frontend

```bash
cd online-exam-system/frontend
```

### Step 3: Install Dependencies

```bash
npm install
```

This will take 1-2 minutes.

### Step 4: Verify Frontend Installation

```bash
npm run dev
```

✅ **Success!** You should see:
```
VITE v5.0.8  ready in 500 ms
➜  Local:   http://localhost:3000/
```

Press `Ctrl + C` to stop for now.

---

## 5️⃣ Running the Application

You need **TWO terminals** running at the same time.

### Terminal 1 - Backend

```bash
# Navigate to backend
cd online-exam-system/backend

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate     # Windows

# Start backend
python main.py
```

**Leave this running!** ✅

### Terminal 2 - Frontend

```bash
# Navigate to frontend
cd online-exam-system/frontend

# Start frontend
npm run dev
```

**Leave this running!** ✅

### Access Application

Your browser should automatically open to:
```
http://localhost:3000
```

If not, manually open this URL in your browser.

---

## 6️⃣ Verification

### Check Backend is Running

Open: `http://localhost:8000/docs`

You should see the **FastAPI interactive documentation**.

### Check Frontend is Running

Open: `http://localhost:3000`

You should see the **login screen** with Admin and Student options.

### Test Admin Login

1. Enter password: `admin123`
2. Click "Login as Admin"
3. ✅ You should see the Admin Dashboard

---

## 7️⃣ Common Issues

### Issue: "Port already in use"

**Backend (Port 8000):**
```bash
# macOS/Linux
lsof -i :8000
kill -9 [PID]

# Windows
netstat -ano | findstr :8000
taskkill /PID [PID] /F
```

**Frontend (Port 3000):**
```bash
# macOS/Linux
lsof -i :3000
kill -9 [PID]

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### Issue: "python3: command not found"

**macOS/Linux:**
```bash
# Install Python
brew install python@3.11  # macOS
sudo apt install python3   # Linux
```

**Windows:**
- Use `python` instead of `python3`
- Or reinstall Python and check "Add to PATH"

### Issue: "npm: command not found"

Install Node.js from https://nodejs.org/

### Issue: Virtual environment won't activate

**Windows PowerShell Execution Policy:**
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try activating again.

### Issue: "Module not found" errors

**Backend:**
```bash
# Deactivate and reactivate venv
deactivate
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

**Frontend:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database errors

**Reset database:**
```bash
cd backend
rm exam.db
python main.py  # Creates fresh database
```

### Issue: Camera not working

**macOS:**
1. System Preferences → Security & Privacy
2. Privacy → Camera
3. Enable for your browser

**Windows:**
1. Settings → Privacy → Camera
2. Allow apps to access camera
3. Allow desktop apps to access camera

**Browser:**
- Chrome: Settings → Privacy → Site Settings → Camera
- Firefox: Preferences → Privacy → Permissions → Camera
- Safari: Preferences → Websites → Camera

---

## ✅ Installation Complete!

You should now have:
- ✅ Backend running on http://localhost:8000
- ✅ Frontend running on http://localhost:3000
- ✅ Admin dashboard accessible
- ✅ Database initialized

## 🎯 Next Steps

1. Read the [README.md](README.md) for usage instructions
2. Add some students through admin panel
3. Upload exam questions
4. Start your first exam!

---

## 🆘 Still Having Issues?

1. Check both terminals for error messages
2. Ensure Python and Node.js are correctly installed
3. Make sure ports 8000 and 3000 are free
4. Try restarting your computer
5. Create an issue on GitHub with error details

---

**Happy Examining! 🎓**
