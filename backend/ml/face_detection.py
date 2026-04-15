import cv2
import numpy as np
import base64

# Load face detection model
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

def detect_faces(image_base64):
    try:
        # Convert base64 → image
        image_data = base64.b64decode(image_base64.split(',')[1])
        np_arr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        face_count = len(faces)

        if face_count == 0:
            return {
                "status": "no_face",
                "message": "No face detected"
            }

        elif face_count > 1:
            return {
                "status": "multiple_faces",
                "message": f"{face_count} faces detected"
            }

        else:
            return {
                "status": "ok",
                "message": "Single face detected"
            }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }