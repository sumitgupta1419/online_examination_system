const API_BASE_URL = 'http://localhost:8000';

export const api = {
  // Admin endpoints
  adminLogin: async (password) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    return response.json();
  },

  changeAdminPassword: async (oldPassword, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/admin/change-password?old_password=${oldPassword}&new_password=${newPassword}`, {
      method: 'POST',
    });
    return response.json();
  },

  addStudent: async (studentId, name, password) => {
    const response = await fetch(`${API_BASE_URL}/admin/add-student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student_id: studentId, name, password }),
    });
    return response.json();
  },

  deleteStudent: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/admin/delete-student/${studentId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  uploadQuestions: async (questions) => {
    const response = await fetch(`${API_BASE_URL}/admin/upload-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questions }),
    });
    return response.json();
  },

  startExam: async (durationMinutes = 60) => {
    const response = await fetch(`${API_BASE_URL}/admin/start-exam?duration_minutes=${durationMinutes}`, {
      method: 'POST',
    });
    return response.json();
  },

  stopExam: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stop-exam`, {
      method: 'POST',
    });
    return response.json();
  },

  getStudents: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/students`);
    return response.json();
  },

  getAdminExamStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/exam-status`);
    return response.json();
  },

  getSubmissions: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/submissions`);
    return response.json();
  },

  // Exam endpoints
  studentLogin: async (studentId, password) => {
    const response = await fetch(`${API_BASE_URL}/exam/student-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student_id: studentId, password }),
    });
    return response.json();
  },

  getExamStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/exam/status`);
    return response.json();
  },

  getAllQuestions: async () => {
    const response = await fetch(`${API_BASE_URL}/exam/questions`);
    return response.json();
  },

  getQuestion: async (questionId) => {
    const response = await fetch(`${API_BASE_URL}/exam/question/${questionId}`);
    return response.json();
  },

  submitAnswer: async (studentId, questionId, selectedAnswer) => {
    const response = await fetch(`${API_BASE_URL}/exam/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id: studentId,
        question_id: questionId,
        selected_answer: selectedAnswer,
      }),
    });
    return response.json();
  },

  submitExam: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/exam/submit?student_id=${studentId}`, {
      method: 'POST',
    });
    return response.json();
  },

  getMyAnswers: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/exam/my-answers/${studentId}`);
    return response.json();
  },

  // Proctor endpoints
  uploadScreenshot: async (studentId, imageData) => {
    const response = await fetch(`${API_BASE_URL}/proctor/screenshot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id: studentId,
        image_data: imageData,
      }),
    });
    return response.json();
  },

  getStudentScreenshots: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/proctor/screenshots/${studentId}`);
    return response.json();
  },
};
