from fastapi import APIRouter, HTTPException
from datetime import datetime
import base64
import os
from models import ScreenshotUpload
from database import get_db

router = APIRouter(prefix="/proctor", tags=["proctor"])

SCREENSHOTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "screenshots")

# Ensure screenshots directory exists
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

@router.post("/screenshot")
async def upload_screenshot(screenshot: ScreenshotUpload):
    """Save a proctoring screenshot"""
    try:
        # Decode base64 image
        image_data = screenshot.image_data
        
        # Remove data URL prefix if present
        if "," in image_data:
            image_data = image_data.split(",")[1]
        
        # Generate filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        filename = f"{screenshot.student_id}_{timestamp}.png"
        filepath = os.path.join(SCREENSHOTS_DIR, filename)
        
        # Save image
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(image_data))
        
        # Save to database
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO screenshots (student_id, filename, timestamp)
                VALUES (?, ?, ?)
            ''', (screenshot.student_id, filename, datetime.now().isoformat()))
            conn.commit()
        
        return {
            "success": True,
            "message": "Screenshot saved successfully",
            "filename": filename
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/screenshots/{student_id}")
async def get_student_screenshots(student_id: str):
    """Get all screenshots for a student"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT filename, timestamp
                FROM screenshots
                WHERE student_id = ?
                ORDER BY timestamp DESC
            ''', (student_id,))
            
            screenshots = cursor.fetchall()
            
            return {
                "success": True,
                "screenshots": [dict(s) for s in screenshots]
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
