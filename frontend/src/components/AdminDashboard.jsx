import React, { useState, useEffect } from 'react';
import { api } from '../api';
import '../styles/admin.css';

const AdminDashboard = () => {
  const [examStatus, setExamStatus] = useState({
    is_active: false,
    total_questions: 0,
    total_students: 0,
    duration_minutes: 60,
  });
  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [questionsJson, setQuestionsJson] = useState('');
  const [duration, setDuration] = useState(60);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Student management state
  const [newStudentId, setNewStudentId] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');

  useEffect(() => {
    loadExamStatus();
    loadStudents();
    const interval = setInterval(() => {
      loadExamStatus();
      loadStudents();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadExamStatus = async () => {
    try {
      const response = await api.getAdminExamStatus();
      if (response.success) {
        setExamStatus(response);
      }
    } catch (error) {
      console.error('Error loading exam status:', error);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await api.getStudents();
      if (response.success) {
        setStudents(response.students);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadSubmissions = async () => {
    try {
      const response = await api.getSubmissions();
      if (response.success) {
        setSubmissions(response.submissions);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await api.addStudent(newStudentId, newStudentName, newStudentPassword);
      if (response.success) {
        setMessage({ text: response.message, type: 'success' });
        setNewStudentId('');
        setNewStudentName('');
        setNewStudentPassword('');
        loadStudents();
      }
    } catch (error) {
      setMessage({ text: 'Failed to add student', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm(`Delete student ${studentId}?`)) {
      try {
        const response = await api.deleteStudent(studentId);
        if (response.success) {
          setMessage({ text: 'Student deleted successfully', type: 'success' });
          loadStudents();
        }
      } catch (error) {
        setMessage({ text: 'Failed to delete student', type: 'error' });
      }
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleUploadQuestions = async () => {
    try {
      const questions = JSON.parse(questionsJson);
      const response = await api.uploadQuestions(questions);
      if (response.success) {
        setMessage({ text: response.message, type: 'success' });
        loadExamStatus();
        setQuestionsJson('');
      }
    } catch (error) {
      setMessage({ text: 'Invalid JSON format or upload failed', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleStartExam = async () => {
    try {
      const response = await api.startExam(duration);
      if (response.success) {
        setMessage({ text: response.message, type: 'success' });
        loadExamStatus();
      }
    } catch (error) {
      setMessage({ text: 'Failed to start exam', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleStopExam = async () => {
    try {
      const response = await api.stopExam();
      if (response.success) {
        setMessage({ text: response.message, type: 'success' });
        loadExamStatus();
      }
    } catch (error) {
      setMessage({ text: 'Failed to stop exam', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const sampleJson = `[
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
  }
]`;

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            Overview
          </button>
          <button
            className={`nav-item ${activeTab === 'manage-students' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage-students')}
          >
            <span className="nav-icon">👥</span>
            Manage Students
          </button>
          <button
            className={`nav-item ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            <span className="nav-icon">📝</span>
            Questions
          </button>
          <button
            className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <span className="nav-icon">👨‍🎓</span>
            Connected Students
          </button>
          <button
            className={`nav-item ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('submissions');
              loadSubmissions();
            }}
          >
            <span className="nav-icon">✅</span>
            Submissions
          </button>
        </nav>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <h1>Exam Management Dashboard</h1>
          <div className="exam-status-badge">
            <span className={`status-indicator ${examStatus.is_active ? 'active' : 'inactive'}`}></span>
            {examStatus.is_active ? 'Exam Active' : 'Exam Inactive'}
          </div>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <div className="stat-value">{examStatus.total_questions}</div>
                  <div className="stat-label">Total Questions</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👨‍🎓</div>
                <div className="stat-content">
                  <div className="stat-value">{examStatus.total_students}</div>
                  <div className="stat-label">Registered Students</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <div className="stat-value">{examStatus.duration_minutes}</div>
                  <div className="stat-label">Duration (mins)</div>
                </div>
              </div>
            </div>

            <div className="control-card">
              <h3>Exam Controls</h3>
              <div className="control-group">
                <label>
                  Exam Duration (minutes):
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                    min="1"
                    max="300"
                    disabled={examStatus.is_active}
                  />
                </label>
              </div>
              <div className="button-group">
                <button
                  className="btn btn-success"
                  onClick={handleStartExam}
                  disabled={examStatus.is_active || examStatus.total_questions === 0}
                >
                  Start Exam
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleStopExam}
                  disabled={!examStatus.is_active}
                >
                  Stop Exam
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'manage-students' && (
          <div className="tab-content">
            <div className="upload-card">
              <h3>Add New Student</h3>
              <form onSubmit={handleAddStudent} className="student-form-inline">
                <input
                  type="text"
                  placeholder="Student ID"
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Student Name"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newStudentPassword}
                  onChange={(e) => setNewStudentPassword(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary">Add Student</button>
              </form>
            </div>

            <div className="students-card">
              <h3>All Students ({students.length})</h3>
              {students.length === 0 ? (
                <p className="empty-state">No students added yet</p>
              ) : (
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Added At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.student_id}>
                        <td>{student.student_id}</td>
                        <td>{student.name}</td>
                        <td>{new Date(student.connected_at).toLocaleString()}</td>
                        <td>
                          <button 
                            className="btn-delete" 
                            onClick={() => handleDeleteStudent(student.student_id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="tab-content">
            <div className="upload-card">
              <h3>Upload Questions</h3>
              <p className="help-text">Paste your questions in JSON format below:</p>
              <textarea
                className="json-input"
                value={questionsJson}
                onChange={(e) => setQuestionsJson(e.target.value)}
                placeholder={sampleJson}
                disabled={examStatus.is_active}
                rows="15"
              />
              <button
                className="btn btn-primary"
                onClick={handleUploadQuestions}
                disabled={examStatus.is_active || !questionsJson.trim()}
              >
                Upload Questions
              </button>
              {examStatus.is_active && (
                <p className="warning-text">Cannot upload questions while exam is active</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="tab-content">
            <div className="students-card">
              <h3>Connected Students ({students.length})</h3>
              {students.length === 0 ? (
                <p className="empty-state">No students connected yet</p>
              ) : (
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Last Connected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.student_id}>
                        <td>{student.student_id}</td>
                        <td>{student.name}</td>
                        <td>{new Date(student.connected_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="tab-content">
            <div className="submissions-card">
              <h3>Student Submissions ({submissions.length})</h3>
              {submissions.length === 0 ? (
                <p className="empty-state">No submissions yet</p>
              ) : (
                <div className="submissions-list">
                  {submissions.map((submission) => (
                    <div key={submission.student_id} className="submission-item">
                      <div className="submission-header">
                        <strong>Student ID:</strong> {submission.student_id}
                      </div>
                      <div className="submission-stats">
                        <span>Answered: {submission.total_answered} questions</span>
                      </div>
                      <details className="submission-details">
                        <summary>View Answers</summary>
                        <table className="answers-table">
                          <thead>
                            <tr>
                              <th>Question</th>
                              <th>Answer</th>
                              <th>Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {submission.answers.map((answer) => (
                              <tr key={answer.question_id}>
                                <td>Q{answer.question_id}</td>
                                <td>{answer.selected_answer}</td>
                                <td>{new Date(answer.timestamp).toLocaleTimeString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
