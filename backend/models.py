from pydantic import BaseModel
from typing import Dict, List, Optional

class QuestionOption(BaseModel):
    A: str
    B: str
    C: str
    D: str
    E: str

class Question(BaseModel):
    question: str
    options: QuestionOption
    correct: str

class QuestionList(BaseModel):
    questions: List[Question]

class ExamStatus(BaseModel):
    is_active: bool
    start_time: Optional[str] = None
    duration_minutes: int = 60

class Student(BaseModel):
    student_id: str
    name: str
    password: Optional[str] = None

class StudentLogin(BaseModel):
    student_id: str
    password: str

class AdminLogin(BaseModel):
    password: str

class Answer(BaseModel):
    student_id: str
    question_id: int
    selected_answer: str

class ScreenshotUpload(BaseModel):
    student_id: str
    image_data: str  # Base64 encoded
