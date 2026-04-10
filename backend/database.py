import sqlite3
from contextlib import contextmanager
import os
#  import from datetime import datetime

DATABASE_PATH = os.path.join(os.path.dirname(__file__), "exam.db")

def init_db():
    """Initialize database with required tables"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Admin credentials table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS admin_credentials (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            password TEXT NOT NULL DEFAULT 'admin123'
        )
    ''')
    
    # Initialize admin password if not exists
    cursor.execute('''
        INSERT OR IGNORE INTO admin_credentials (id, password) 
        VALUES (1, 'admin123')
    ''')
    
    # Questions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            option_a TEXT NOT NULL,
            option_b TEXT NOT NULL,
            option_c TEXT NOT NULL,
            option_d TEXT NOT NULL,
            option_e TEXT NOT NULL,
            correct_answer TEXT NOT NULL
        )
    ''')
    
    # Exam status table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS exam_status (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            is_active INTEGER DEFAULT 0,
            start_time TEXT,
            duration_minutes INTEGER DEFAULT 60
        )
    ''')
    
    # Initialize exam_status with default values if not exists
    cursor.execute('''
        INSERT OR IGNORE INTO exam_status (id, is_active, duration_minutes) 
        VALUES (1, 0, 60)
    ''')
    # from datetime import datetime

# cursor.execute('''
#     INSERT OR IGNORE INTO exam_status (id, is_active, start_time, duration_minutes) 
#     VALUES (1, 0, ?, 60)
# ''', (datetime.now().isoformat(),))
    
    # Students table - NOW WITH PASSWORD
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            password TEXT NOT NULL,
            connected_at TEXT NOT NULL
        )
    ''')
    
    # Answers table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            question_id INTEGER NOT NULL,
            selected_answer TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            FOREIGN KEY (question_id) REFERENCES questions(id)
        )
    ''')
    
    # Screenshots table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS screenshots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            filename TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()

@contextmanager
def get_db():
    """Context manager for database connections"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()
