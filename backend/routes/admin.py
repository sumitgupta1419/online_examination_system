from fastapi import APIRouter, HTTPException
from datetime import datetime
from models import QuestionList, ExamStatus, AdminLogin, Student
from database import get_db

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/login")
async def admin_login(credentials: AdminLogin):
    """Admin login"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT password FROM admin_credentials WHERE id = 1")
            result = cursor.fetchone()
            
            if result and result['password'] == credentials.password:
                return {
                    "success": True,
                    "message": "Login successful"
                }
            else:
                raise HTTPException(status_code=401, detail="Invalid password")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/change-password")
async def change_admin_password(old_password: str, new_password: str):
    """Change admin password"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT password FROM admin_credentials WHERE id = 1")
            result = cursor.fetchone()
            
            if result and result['password'] == old_password:
                cursor.execute("UPDATE admin_credentials SET password = ? WHERE id = 1", (new_password,))
                conn.commit()
                return {
                    "success": True,
                    "message": "Password changed successfully"
                }
            else:
                raise HTTPException(status_code=401, detail="Invalid old password")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/add-student")
async def add_student(student: Student):
    """Admin adds a student with credentials"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            connected_at = datetime.now().isoformat()
            
            # Check if student exists
            cursor.execute("SELECT * FROM students WHERE student_id = ?", (student.student_id,))
            existing = cursor.fetchone()
            
            if existing:
                raise HTTPException(status_code=400, detail="Student ID already exists")
            
            # Insert new student
            cursor.execute('''
                INSERT INTO students (student_id, name, password, connected_at)
                VALUES (?, ?, ?, ?)
            ''', (student.student_id, student.name, student.password, connected_at))
            
            conn.commit()
            return {
                "success": True,
                "message": f"Student {student.name} added successfully"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/delete-student/{student_id}")
async def delete_student(student_id: str):
    """Delete a student"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM students WHERE student_id = ?", (student_id,))
            conn.commit()
            return {
                "success": True,
                "message": "Student deleted successfully"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-questions")
async def upload_questions(questions: QuestionList):
    """Upload exam questions before exam starts"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Check if exam is active
            cursor.execute("SELECT is_active FROM exam_status WHERE id = 1")
            status = cursor.fetchone()
            if status and status['is_active'] == 1:
                raise HTTPException(status_code=400, detail="Cannot upload questions while exam is active")
            
            # Clear existing questions
            cursor.execute("DELETE FROM questions")
            
            # Insert new questions
            for q in questions.questions:
                cursor.execute('''
                    INSERT INTO questions 
                    (question, option_a, option_b, option_c, option_d, option_e, correct_answer)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (
                    q.question,
                    q.options.A,
                    q.options.B,
                    q.options.C,
                    q.options.D,
                    q.options.E,
                    q.correct
                ))
            
            conn.commit()
            return {
                "success": True,
                "message": f"Successfully uploaded {len(questions.questions)} questions"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/start-exam")
async def start_exam(duration_minutes: int = 60):
    """Start the exam"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Check if questions exist
            cursor.execute("SELECT COUNT(*) as count FROM questions")
            count = cursor.fetchone()['count']
            if count == 0:
                raise HTTPException(status_code=400, detail="No questions uploaded. Please upload questions first.")
            
            # Start exam
            start_time = datetime.now().isoformat()
            cursor.execute('''
                UPDATE exam_status 
                SET is_active = 1, start_time = ?, duration_minutes = ?
                WHERE id = 1
            ''', (start_time, duration_minutes))
            
            conn.commit()
            return {
                "success": True,
                "message": "Exam started successfully",
                "start_time": start_time,
                "duration_minutes": duration_minutes
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stop-exam")
async def stop_exam():
    """Stop/terminate the exam"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE exam_status 
                SET is_active = 0, start_time = NULL
                WHERE id = 1
            ''')
            conn.commit()
            return {
                "success": True,
                "message": "Exam stopped successfully"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/students")
async def get_students():
    """Get list of connected students"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT student_id, name, connected_at FROM students")
            students = cursor.fetchall()
            return {
                "success": True,
                "students": [dict(s) for s in students]
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/exam-status")
async def get_exam_status():
    """Get current exam status"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM exam_status WHERE id = 1")
            status = cursor.fetchone()
            
            cursor.execute("SELECT COUNT(*) as count FROM questions")
            question_count = cursor.fetchone()['count']
            
            cursor.execute("SELECT COUNT(*) as count FROM students")
            student_count = cursor.fetchone()['count']
            
            return {
                "success": True,
                "is_active": bool(status['is_active']),
                "start_time": status['start_time'],
                "duration_minutes": status['duration_minutes'],
                "total_questions": question_count,
                "total_students": student_count
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/submissions")
async def get_submissions():
    """Get all student submissions"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT DISTINCT student_id 
                FROM answers
            ''')
            students = cursor.fetchall()
            
            submissions = []
            for student in students:
                student_id = student['student_id']
                cursor.execute('''
                    SELECT question_id, selected_answer, timestamp
                    FROM answers
                    WHERE student_id = ?
                    ORDER BY question_id
                ''', (student_id,))
                answers = cursor.fetchall()
                
                submissions.append({
                    "student_id": student_id,
                    "answers": [dict(a) for a in answers],
                    "total_answered": len(answers)
                })
            
            return {
                "success": True,
                "submissions": submissions
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
