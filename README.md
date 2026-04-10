# 🎓 Online Examination System with AI Proctoring

A complete web-based examination platform with real-time proctoring capabilities, built for educational institutions.

![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-green.svg)
![License](https://img.shields.io/badge/license-Educational-orange.svg)

## ✨ Features

### 👨‍💼 Admin Panel
- 🔐 Secure password-protected login
- 👥 Complete student management (Add/Delete/View students)
- 📝 Upload exam questions in JSON format
- ⏱️ Configure exam duration
- 🚀 Start/Stop exams in real-time
- 📊 View all student submissions
- 📸 Access proctoring screenshots

### 👨‍🎓 Student Portal
- 🔑 Secure login with credentials
- ⏳ Waiting room before exam starts
- 📹 Automatic camera activation for proctoring
- 🧭 Question navigation (Previous/Next/Jump to Question)
- 🚩 Flag questions for review
- ⏱️ Live countdown timer
- 💾 Auto-save answers
- 📤 Manual or automatic submission

### 🤖 AI Proctoring Features
- 📸 Screenshot capture every 30 seconds
- 🎥 Webcam monitoring throughout exam
- 💾 Secure screenshot storage
- ⚠️ Camera permission alerts
- 🔒 Privacy-focused design

## 🛠️ Tech Stack

**Backend:**
- Python 3.8+
- FastAPI (Modern, fast web framework)
- Uvicorn (ASGI server)
- SQLite (Lightweight database)
- Pydantic (Data validation)

**Frontend:**
- React 18 with Vite
- Modern CSS (No frameworks)
- Fetch API for HTTP requests
- Browser APIs (Camera, Canvas)

## 📋 Prerequisites

Before running this project, ensure you have:

- **Python 3.8 or higher** - [Download](https://www.python.org/downloads/)
- **Node.js 16 or higher** - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

### Check Installed Versions

```bash
python3 --version   # Should be 3.8+
node --version      # Should be 16+
npm --version       # Should be 6+
```

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/online-exam-system.git
cd online-exam-system
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Frontend Setup

Open a **NEW terminal window** and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

## ▶️ Running the Application

You need **TWO terminal windows** running simultaneously.

### Terminal 1 - Backend Server

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

✅ **Success!** You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Terminal 2 - Frontend Server

```bash
cd frontend
npm run dev
```

✅ **Success!** You should see:
```
  VITE v5.0.8  ready in 500 ms
  ➜  Local:   http://localhost:3000/
```

Your browser will automatically open to `http://localhost:3000`

## 📖 Usage Guide

### First Time Setup

#### 1. **Admin Login**
- Open: `http://localhost:3000`
- Default password: `admin123`
- Click "Login as Admin"

#### 2. **Add Students**
- Click "Manage Students" tab
- Fill in the form:
  - Student ID: `STU001`
  - Student Name: `John Doe`
  - Password: `student123`
- Click "Add Student"
- Repeat for more students

#### 3. **Upload Questions**
- Click "Questions" tab
- Paste questions in JSON format (see example below)
- Click "Upload Questions"

**Example Questions JSON:**
```json
[
  {
    "question": "What is 2 + 2?",
    "options": {
      "A": "1",
      "B": "2",
      "C": "3",
      "D": "4",
      "E": "5"
    },
    "correct": "D"
  },
  {
    "question": "What is the capital of France?",
    "options": {
      "A": "London",
      "B": "Berlin",
      "C": "Paris",
      "D": "Madrid",
      "E": "Rome"
    },
    "correct": "C"
  }
]
```

#### 4. **Start Exam**
- Click "Overview" tab
- Set exam duration (e.g., 30 minutes)
- Click "Start Exam"
- Badge will turn green: "Exam Active"

#### 5. **Student Takes Exam**
- Open new browser tab: `http://localhost:3000`
- Enter credentials:
  - Student ID: `STU001`
  - Password: `student123`
- Click "Enter Exam"
- Allow camera access when prompted
- Answer questions
- Click "Submit Exam" when done

#### 6. **View Results**
- Go back to Admin tab
- Click "Submissions" tab
- View student answers and timestamps

## 📁 Project Structure

```
online-exam-system/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── database.py             # Database configuration & initialization
│   ├── models.py               # Pydantic data models
│   ├── requirements.txt        # Python dependencies
│   ├── routes/
│   │   ├── admin.py           # Admin API endpoints
│   │   ├── exam.py            # Exam API endpoints
│   │   └── proctor.py         # Proctoring API endpoints
│   ├── screenshots/           # Stored proctoring screenshots
│   └── exam.db                # SQLite database (auto-created)
│
└── frontend/
    ├── src/
    │   ├── main.jsx           # React entry point
    │   ├── App.jsx            # Main application component
    │   ├── api.js             # API communication layer
    │   ├── components/
    │   │   ├── AdminDashboard.jsx    # Admin interface
    │   │   └── ExamPage.jsx          # Student exam interface
    │   └── styles/
    │       ├── admin.css      # Admin dashboard styles
    │       └── exam.css       # Exam page styles
    ├── index.html             # HTML template
    ├── package.json           # Node.js dependencies
    └── vite.config.js         # Vite configuration
```

## 🔌 API Endpoints

### Admin Endpoints
- `POST /admin/login` - Admin authentication
- `POST /admin/add-student` - Add new student
- `DELETE /admin/delete-student/{id}` - Remove student
- `POST /admin/upload-questions` - Upload exam questions
- `POST /admin/start-exam` - Start examination
- `POST /admin/stop-exam` - Stop examination
- `GET /admin/students` - Get all students
- `GET /admin/submissions` - Get all submissions

### Exam Endpoints
- `POST /exam/student-login` - Student authentication
- `GET /exam/status` - Get exam status
- `GET /exam/questions` - Get all questions
- `POST /exam/answer` - Submit answer
- `POST /exam/submit` - Submit complete exam

### Proctoring Endpoints
- `POST /proctor/screenshot` - Upload screenshot
- `GET /proctor/screenshots/{student_id}` - Get student screenshots

**Full API Documentation:** `http://localhost:8000/docs`

## 🗄️ Database Schema

**Tables:**

1. **admin_credentials**
   - id, password

2. **students**
   - id, student_id, name, password, connected_at

3. **questions**
   - id, question, option_a, option_b, option_c, option_d, option_e, correct_answer

4. **exam_status**
   - id, is_active, start_time, duration_minutes

5. **answers**
   - id, student_id, question_id, selected_answer, timestamp

6. **screenshots**
   - id, student_id, filename, timestamp

## 🔐 Default Credentials

**Admin:**
- Password: `admin123`

**Students:**
- Must be created by admin
- Admin sets ID, name, and password

## 🐛 Troubleshooting

### Backend won't start

**Problem:** Port 8000 already in use
```bash
# Find process using port 8000
lsof -i :8000
# Kill it (replace PID with actual number)
kill -9 PID
```

**Problem:** Module not found errors
```bash
# Make sure virtual environment is activated
source venv/bin/activate
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend won't start

**Problem:** Port 3000 already in use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 PID
```

**Problem:** Dependencies error
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Camera not working

**macOS:**
1. System Preferences → Security & Privacy → Privacy
2. Click "Camera"
3. Enable for your browser

**Browser:**
1. Click camera icon in address bar
2. Select "Always allow"
3. Refresh page

### Database issues

**Reset database:**
```bash
cd backend
rm exam.db
python main.py  # Will create fresh database
```

## 🔄 Stopping the Application

**Terminal 1 (Backend):**
Press `Ctrl + C`

**Terminal 2 (Frontend):**
Press `Ctrl + C`

## 🌟 Future Enhancements

- [ ] Face recognition for identity verification
- [ ] Eye tracking for attention monitoring
- [ ] Multiple tab detection
- [ ] Report generation (PDF)
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Question bank management
- [ ] Multiple choice and subjective questions
- [ ] Automated grading

## 📄 License

This project is developed for educational purposes as part of a final year project.

## 👨‍💻 Author

**Your Name**
- University/College: [Your Institution]
- Department: [Your Department]
- Academic Year: [Year]
- Project Guide: [Guide Name]

## 🙏 Acknowledgments

- FastAPI documentation
- React documentation
- Anthropic Claude for development assistance

## 📞 Contact

For queries or suggestions:
- Email: pillibharath23@gmail.com
- GitHub: bharathp23

---

⭐ **If you find this project useful, please give it a star!**
