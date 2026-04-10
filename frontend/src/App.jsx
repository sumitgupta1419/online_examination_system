import React, { useState } from 'react';
import AdminDashboard from './components/AdminDashboard';
import ExamPage from './components/ExamPage';
import './styles/admin.css';
import './styles/exam.css';
import { api } from './api';

function App() {
  const [role, setRole] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const response = await api.adminLogin(adminPassword);
      if (response.success) {
        setRole('admin');
        setIsAuthenticated(true);
      }
    } catch (error) {
      setLoginError('Invalid admin password');
    }
  };

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (!studentId.trim() || !studentPassword.trim()) {
      setLoginError('Please enter both Student ID and Password');
      return;
    }
    
    try {
      const response = await api.studentLogin(studentId, studentPassword);
      if (response.success) {
        setStudentName(response.student.name);
        setRole('student');
        setIsAuthenticated(true);
      }
    } catch (error) {
      setLoginError('Invalid student ID or password');
    }
  };

  const handleLogout = () => {
    setRole(null);
    setIsAuthenticated(false);
    setStudentId('');
    setStudentName('');
    setStudentPassword('');
    setAdminPassword('');
    setLoginError('');
  };

  if (!role) {
    return (
      <div className="role-selection">
        <div className="role-container">
          <h1 className="app-title">Online Examination System</h1>
          <p className="app-subtitle">Select your role to continue</p>
          
          <div className="role-cards">
            <div className="role-card admin-role">
              <div className="role-icon">👨‍💼</div>
              <h2>Admin</h2>
              <p>Manage exams and monitor students</p>
              <form className="login-form" onSubmit={handleAdminLogin}>
                <input
                  type="password"
                  placeholder="Admin Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Login as Admin
                </button>
                <p className="hint-text">Default password: admin123</p>
              </form>
            </div>
            
            <div className="role-card student-role">
              <div className="role-icon">👨‍🎓</div>
              <h2>Student</h2>
              <p>Take the examination</p>
              <form className="login-form" onSubmit={handleStudentLogin}>
                <input
                  type="text"
                  placeholder="Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Enter Exam
                </button>
                <p className="hint-text">Contact admin for credentials</p>
              </form>
            </div>
          </div>
          
          {loginError && (
            <div className="error-message">
              ⚠️ {loginError}
            </div>
          )}
          
          <div className="role-footer">
            <p>🔒 Secure Online Examination Platform</p>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'admin' && isAuthenticated) {
    return (
      <div>
        <button className="back-button" onClick={handleLogout}>
          ← Logout
        </button>
        <AdminDashboard />
      </div>
    );
  }

  if (role === 'student' && isAuthenticated) {
    return (
      <div>
        <button className="back-button" onClick={handleLogout}>
          ← Logout
        </button>
        <ExamPage studentId={studentId} studentName={studentName} />
      </div>
    );
  }

  return null;
}

export default App;
