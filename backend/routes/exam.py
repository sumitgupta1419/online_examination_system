from fastapi import APIRouter, HTTPException
from datetime import datetime,timedelta
from models import Answer, StudentLogin
from database import get_db
from ml.face_detection import detect_faces

# from ml.eye_tracking import detect_eye_gaze



router = APIRouter(prefix="/exam", tags=["exam"])


from ml.face_detection import detect_faces

# Store scores (temporary memory)
cheating_scores = {}



# @router.post("/analyze")
# async def analyze_image(data: dict):
#     try:
#         student_id = data.get("student_id")
#         image = data.get("image")

#         if not student_id:
#             raise HTTPException(status_code=400, detail="student_id required")

#         # Initialize score
#         if student_id not in cheating_scores:
#             cheating_scores[student_id] = 0

#         # 🔍 Face detection
#         face_result = detect_faces(image)

#         score_add = 0

#         # 🚨 RULES
#         if face_result["status"] == "no_face":
#             score_add = 30

#         elif face_result["status"] == "multiple_faces":
#             score_add = 50

#         # ✅ ADD SCORE (IMPORTANT)
#         cheating_scores[student_id] += score_add

#         return {
#             "success": True,
#             "face": face_result,
#             "score_added": score_add,
#             "total_score": cheating_scores[student_id]
#         }

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
@router.post("/analyze")
async def analyze_image(data: dict):
    student_id = data.get("student_id")
    image = data.get("image")

    # ❗ Validate input
    if not student_id or not image:
        raise HTTPException(status_code=400, detail="Missing student_id or image")

    # Initialize score
    if student_id not in cheating_scores:
        cheating_scores[student_id] = 0

    face_result = detect_faces(image)

    cheating_score = 0

    # Face logic
    if face_result["status"] == "no_face":
        cheating_score += 30
    elif face_result["status"] == "multiple_faces":
        cheating_score += 50

    # ✅ FIX: Only add when cheating happens
    if cheating_score > 0:
        cheating_scores[student_id] += cheating_score
    else:
        # ✅ OPTIONAL: slowly reduce score if normal
        cheating_scores[student_id] = max(0, cheating_scores[student_id] - 5)

    # DEBUG
    print("Face:", face_result)
    print("Score:", cheating_scores[student_id])

    return {
        "face": face_result,
        "cheating_score": cheating_scores[student_id]
    }



@router.get("/cheating-score/{student_id}")
async def get_score(student_id: str):
    score = cheating_scores.get(student_id, 0)

    status = "Safe"
    if score > 70:
        status = "Cheating"
    elif score > 30:
        status = "Suspicious"

    return {
        "student_id": student_id,
        "score": score,
        "status": status
    }





@router.post("/student-login")
async def student_login(credentials: StudentLogin):
    """Student login with password"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM students 
                WHERE student_id = ? AND password = ?
            ''', (credentials.student_id, credentials.password))
            
            student = cursor.fetchone()
            
            if student:
                # Update connection time
                cursor.execute('''
                    UPDATE students 
                    SET connected_at = ?
                    WHERE student_id = ?
                ''', (datetime.now().isoformat(), credentials.student_id))
                conn.commit()
                
                return {
                    "success": True,
                    "message": "Login successful",
                    "student": {
                        "student_id": student['student_id'],
                        "name": student['name']
                    }
                }
            else:
                raise HTTPException(status_code=401, detail="Invalid student ID or password")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

#     # from datetime import datetime, timedelta
from datetime import datetime



@router.get("/status")
async def get_exam_status():
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM exam_status WHERE id = 1")
            status = cursor.fetchone()
            
            cursor.execute("SELECT COUNT(*) as count FROM questions")
            question_count = cursor.fetchone()['count']

            time_left = 0

            if status['is_active'] and status['start_time']:
                start_time = datetime.fromisoformat(status['start_time'])
                now = datetime.now()
                elapsed = (now - start_time).total_seconds()
                total_duration = status['duration_minutes'] * 60
                time_left = max(0, int(total_duration - elapsed))

            return {
                "success": True,
                "is_active": bool(status['is_active']),
                "start_time": status['start_time'],
                "duration_minutes": status['duration_minutes'],
                "total_questions": question_count,
                "time_left": time_left   # ✅ IMPORTANT
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @router.get("/status")
# async def get_exam_status():
#     try:
#         with get_db() as conn:
#             cursor = conn.cursor()
#             cursor.execute("SELECT * FROM exam_status WHERE id = 1")
#             status = cursor.fetchone()

#             cursor.execute("SELECT COUNT(*) as count FROM questions")
#             question_count = cursor.fetchone()['count']

#             # 🔥 FIX STARTS HERE
#             start_time = status['start_time']
#             duration = status['duration_minutes']

#             time_left = 0

#             if start_time:
#                 start_time = datetime.fromisoformat(start_time)
#                 end_time = start_time + timedelta(minutes=duration)

#                 now = datetime.now()
#                 time_left = int((end_time - now).total_seconds())

#                 if time_left < 0:
#                     time_left = 0
#             # 🔥 FIX ENDS HERE

#             return {
#                 "success": True,
#                 "is_active": bool(status['is_active']),
#                 "start_time": status['start_time'],
#                 "duration_minutes": duration,
#                 "time_left": time_left,   # ✅ ADD THIS
#                 "total_questions": question_count
#             }

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.get("/status")
# async def get_exam_status():
#     """Get current exam status"""
#     try:
#         with get_db() as conn:
#             cursor = conn.cursor()
#             cursor.execute("SELECT * FROM exam_status WHERE id = 1")
#             status = cursor.fetchone()
            
#             cursor.execute("SELECT COUNT(*) as count FROM questions")
#             question_count = cursor.fetchone()['count']
            
#             return {
#                 "success": True,
#                 "is_active": bool(status['is_active']),
    #             "start_time": status['start_time'],
    #             "duration_minutes": status['duration_minutes'],
    #             "total_questions": question_count
    #         }
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))

@router.get("/questions")
async def get_all_questions():
    """Get all exam questions (only when exam is active)"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Check if exam is active
            cursor.execute("SELECT is_active FROM exam_status WHERE id = 1")
            status = cursor.fetchone()
            if not status or status['is_active'] == 0:
                raise HTTPException(status_code=403, detail="Exam is not active")
            
            cursor.execute("SELECT * FROM questions")
            questions = cursor.fetchall()
            
            return {
                "success": True,
                "questions": [{
                    "id": q['id'],
                    "question": q['question'],
                    "options": {
                        "A": q['option_a'],
                        "B": q['option_b'],
                        "C": q['option_c'],
                        "D": q['option_d'],
                        "E": q['option_e']
                    }
                } for q in questions]
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/question/{question_id}")
async def get_question(question_id: int):
    """Get a specific question by ID"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Check if exam is active
            cursor.execute("SELECT is_active FROM exam_status WHERE id = 1")
            status = cursor.fetchone()
            if not status or status['is_active'] == 0:
                raise HTTPException(status_code=403, detail="Exam is not active")
            
            cursor.execute("SELECT * FROM questions WHERE id = ?", (question_id,))
            question = cursor.fetchone()
            
            if not question:
                raise HTTPException(status_code=404, detail="Question not found")
            
            return {
                "success": True,
                "question": {
                    "id": question['id'],
                    "question": question['question'],
                    "options": {
                        "A": question['option_a'],
                        "B": question['option_b'],
                        "C": question['option_c'],
                        "D": question['option_d'],
                        "E": question['option_e']
                    }
                }
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/answer")
async def submit_answer(answer: Answer):
    """Submit an answer for a question"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Check if exam is active
            cursor.execute("SELECT is_active FROM exam_status WHERE id = 1")
            status = cursor.fetchone()
            if not status or status['is_active'] == 0:
                raise HTTPException(status_code=403, detail="Exam is not active")
            
            timestamp = datetime.now().isoformat()
            
            # Check if answer already exists
            cursor.execute('''
                SELECT id FROM answers 
                WHERE student_id = ? AND question_id = ?
            ''', (answer.student_id, answer.question_id))
            
            existing = cursor.fetchone()
            
            if existing:
                # Update existing answer
                cursor.execute('''
                    UPDATE answers 
                    SET selected_answer = ?, timestamp = ?
                    WHERE student_id = ? AND question_id = ?
                ''', (answer.selected_answer, timestamp, answer.student_id, answer.question_id))
            else:
                # Insert new answer
                cursor.execute('''
                    INSERT INTO answers (student_id, question_id, selected_answer, timestamp)
                    VALUES (?, ?, ?, ?)
                ''', (answer.student_id, answer.question_id, answer.selected_answer, timestamp))
            
            conn.commit()
            return {
                "success": True,
                "message": "Answer saved successfully"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/submit")
async def submit_exam(student_id: str):
    """Submit the entire exam"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Get student's answers
            cursor.execute('''
                SELECT question_id, selected_answer
                FROM answers
                WHERE student_id = ?
            ''', (student_id,))
            
            answers = cursor.fetchall()
            
            return {
                "success": True,
                "message": "Exam submitted successfully",
                "total_answered": len(answers),
                "student_id": student_id
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/my-answers/{student_id}")
async def get_my_answers(student_id: str):
    """Get all answers for a specific student"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT question_id, selected_answer
                FROM answers
                WHERE student_id = ?
            ''', (student_id,))
            
            answers = cursor.fetchall()
            
            # Convert to dictionary for easy lookup
            answer_dict = {a['question_id']: a['selected_answer'] for a in answers}
            
            return {
                "success": True,
                "answers": answer_dict
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
