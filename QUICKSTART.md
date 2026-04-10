# ⚡ QUICK START GUIDE

Get up and running in 5 minutes!

## 📋 Prerequisites

- Python 3.8+ installed
- Node.js 16+ installed
- Git installed

## 🚀 Quick Setup

### 1. Clone & Navigate

```bash
git clone https://github.com/YOUR_USERNAME/online-exam-system.git
cd online-exam-system
```

### 2. Backend Setup (Terminal 1)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### 3. Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

## ✅ That's It!

Open: http://localhost:3000

**Admin Login:** Password is `admin123`

## 📖 First Time Setup

1. **Login as Admin** (password: `admin123`)
2. **Go to "Manage Students"** → Add a student
3. **Go to "Questions"** → Upload questions (see sample below)
4. **Go to "Overview"** → Start exam

### Sample Questions

```json
[
  {
    "question": "What is 2 + 2?",
    "options": {"A": "1", "B": "2", "C": "3", "D": "4", "E": "5"},
    "correct": "D"
  }
]
```

## 🎯 Test Student Login

1. Open new tab: http://localhost:3000
2. Login with student credentials you created
3. Take the exam!

## 📚 Need More Help?

- Full guide: See [INSTALLATION.md](INSTALLATION.md)
- Usage guide: See [README.md](README.md)

## 🛑 Stopping

Press `Ctrl + C` in both terminals

---

**Happy Testing! 🎓**
