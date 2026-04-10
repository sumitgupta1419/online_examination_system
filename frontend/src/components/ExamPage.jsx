import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import '../styles/exam.css';

const ExamPage = ({ studentId, studentName }) => {
  const [examStatus, setExamStatus] = useState({ is_active: false, total_questions: 0 });
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [examSubmitted, setExamSubmitted] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const screenshotIntervalRef = useRef(null);
  const timerRef = useRef(null);

  // useEffect(() => {
  //   checkExamStatus();
  //   const interval = setInterval(checkExamStatus, 5000);
  //   return () => clearInterval(interval);
  // }, []);
  useEffect(() => {
  checkExamStatus();

  const interval = setInterval(() => {
    if (!examStatus.is_active && !examSubmitted) {
      checkExamStatus();
    }
  }, 5000);

  return () => clearInterval(interval);
}, [examStatus.is_active, examSubmitted]);

  useEffect(() => {
    if (examStatus.is_active && questions.length > 0 && timeRemaining > 0) {
      loadPreviousAnswers();
      startCamera();
      startTimer();
    }
    return () => {
      stopCamera();
      stopTimer();
    };
  }, [examStatus.is_active, questions.length, timeRemaining]);

  const checkExamStatus = async () => {
    if (examSubmitted) return;
    try {
      const response = await api.getExamStatus();
      if (response.success) {
        setExamStatus(response);
        
        if (response.is_active && questions.length === 0) {
          loadQuestions();
          registerStudent();
        }
        
        if (!response.is_active && examStatus.is_active) {
          handleExamEnd();
        }
        
        // if (response.is_active && response.start_time) {
        // if (response.is_active && response.start_time && timeRemaining === 0) {
        //   const startTime = new Date(response.start_time).getTime();
        //   const now = Date.now();
        //   const elapsed = Math.floor((now - startTime) / 1000);
        //   const remaining = (response.duration_minutes * 60) - elapsed;
        //   setTimeRemaining(Math.max(0, remaining));
        // }
//         if (response.is_active && response.time_left !== undefined && timeRemaining === 0) {
//   setTimeRemaining(response.time_left);
// }
if (response.is_active && response.time_left !== undefined) {
  setTimeRemaining(response.time_left);
}
      }
    } catch (error) {
      console.error('Error checking exam status:', error);
    }
  };

  const registerStudent = async () => {
    try {
      await api.registerStudent(studentId, studentName);
    } catch (error) {
      console.error('Error registering student:', error);
    }
  };

  const loadQuestions = async () => {
    try {
      const response = await api.getAllQuestions();
      if (response.success) {
        setQuestions(response.questions);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const loadPreviousAnswers = async () => {
    try {
      const response = await api.getMyAnswers(studentId);
      if (response.success) {
        setSelectedAnswers(response.answers);
      }
    } catch (error) {
      console.error('Error loading previous answers:', error);
    }
  };

  // const startTimer = () => {
  //   const timerInterval = setInterval(() => {
  //     setTimeRemaining((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(timerInterval);
  //         handleAutoSubmit();
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);
  //   return () => clearInterval(timerInterval);
  // };if (response.is_active && response.start_time && timeRemaining === 0) {
const startTimer = () => {
  if (timerRef.current || timeRemaining <= 0) return;

  timerRef.current = setInterval(() => {
    setTimeRemaining((prev) => {
      if (prev <= 1 && !examSubmitted) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        handleAutoSubmit();
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};


const stopTimer = () => {
  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }
  setTimeRemaining(0);
};

  // const stopTimer = () => {
  //   setTimeRemaining(0);
  // };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setCameraError('');
        
        // Start screenshot capture every 30 seconds
        screenshotIntervalRef.current = setInterval(() => {
          captureScreenshot();
        }, 30000);
      }
    } catch (error) {
      console.error('Camera error:', error);
      setCameraError('Camera access denied. Please enable camera permissions.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (screenshotIntervalRef.current) {
      clearInterval(screenshotIntervalRef.current);
    }
    setCameraActive(false);
  };

  const captureScreenshot = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');

    try {
      await api.uploadScreenshot(studentId, imageData);
    } catch (error) {
      console.error('Error uploading screenshot:', error);
    }
  };

  const handleAnswerSelect = async (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answer,
    });

    try {
      await api.submitAnswer(studentId, currentQuestion.id, answer);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleFlagQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(currentQuestion.id)) {
      newFlagged.delete(currentQuestion.id);
    } else {
      newFlagged.add(currentQuestion.id);
    }
    setFlaggedQuestions(newFlagged);
  };

  const handleSubmitExam = async () => {
    if (window.confirm('Are you sure you want to submit your exam? This action cannot be undone.')) {
      try {
        const response = await api.submitExam(studentId);
        if (response.success) {
          setExamSubmitted(true);
          stopCamera();
          alert('Exam submitted successfully!');
        }
      } catch (error) {
        console.error('Error submitting exam:', error);
        alert('Failed to submit exam. Please try again.');
      }
    }
  };
  const handleAutoSubmit = async () => {
  try {
    // Stop the background status checker immediately
    // If you have the checkExamStatus interval stored in a ref, clear it here.
    
    await api.submitExam(studentId);
  } catch (error) {
    console.error('Error auto-submitting exam:', error);
  } finally {
    // This block runs regardless of success or failure
    stopCamera();
    stopTimer();
    setExamSubmitted(true); // This triggers the "Success" UI screen
    alert('Time is up! Your exam has been automatically submitted.');
  }
};

  // const handleAutoSubmit = async () => {
  //   try {
  //     await api.submitExam(studentId);
  //     setExamSubmitted(true);
  //     stopCamera();
  //     alert('Time is up! Your exam has been automatically submitted.');
  //   } catch (error) {
  //     console.error('Error auto-submitting exam:', error);
  //   }
  // };
  

  const handleExamEnd = () => {
    stopCamera();
    setExamSubmitted(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (examSubmitted) {
    return (
      <div className="exam-container">
        <div className="exam-submitted">
          <div className="submitted-icon">✅</div>
          <h2>Exam Submitted Successfully</h2>
          <p>Thank you for completing the exam, {studentName}!</p>
          <p>Your responses have been recorded.</p>
        </div>
      </div>
    );
  }

  if (!examStatus.is_active) {
    return (
      <div className="exam-container">
        <div className="waiting-screen">
          <div className="waiting-icon">⏳</div>
          <h2>Waiting for Exam to Start</h2>
          <p>Hello, {studentName}!</p>
          <p>Please wait while the administrator starts the exam.</p>
          <div className="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="exam-container">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading exam questions...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="exam-container">
      <div className="exam-header">
        <div className="exam-title">
          <h1>Online Examination</h1>
          <p className="student-info">Student: {studentName} ({studentId})</p>
        </div>
        <div className="exam-timer">
          <span className="timer-icon">⏱️</span>
          <span className={`timer-value ${timeRemaining < 300 ? 'warning' : ''}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      <div className="exam-body">
        <div className="question-navigation">
          <h3>Questions</h3>
          <div className="question-grid">
            {questions.map((q, index) => (
              <button
                key={q.id}
                className={`question-number ${
                  index === currentQuestionIndex ? 'current' : ''
                } ${
                  selectedAnswers[q.id] ? 'answered' : ''
                } ${
                  flaggedQuestions.has(q.id) ? 'flagged' : ''
                }`}
                onClick={() => handleQuestionNavigation(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="nav-legend">
            <div className="legend-item">
              <span className="legend-box current"></span>
              <span>Current</span>
            </div>
            <div className="legend-item">
              <span className="legend-box answered"></span>
              <span>Answered</span>
            </div>
            <div className="legend-item">
              <span className="legend-box flagged"></span>
              <span>Flagged</span>
            </div>
          </div>
          <div className="progress-info">
            <p>{answeredCount} / {questions.length} Answered</p>
          </div>
        </div>

        <div className="question-content">
          <div className="question-header">
            <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
          </div>

          <div className="question-text">
            {currentQuestion.question}
          </div>

          <div className="options-container">
            {Object.entries(currentQuestion.options).map(([key, value]) => (
              <button
                key={key}
                className={`option-card ${
                  selectedAnswers[currentQuestion.id] === key ? 'selected' : ''
                }`}
                onClick={() => handleAnswerSelect(key)}
              >
                <span className="option-letter">{key}</span>
                <span className="option-text">{value}</span>
              </button>
            ))}
          </div>

          <div className="question-controls">
            <button
              className="btn btn-secondary"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              ← Previous
            </button>

            <button
              className={`btn ${flaggedQuestions.has(currentQuestion.id) ? 'btn-warning' : 'btn-secondary'}`}
              onClick={handleFlagQuestion}
            >
              {flaggedQuestions.has(currentQuestion.id) ? '🚩 Flagged' : '🏳️ Flag'}
            </button>

            <button
              className="btn btn-secondary"
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next →
            </button>

            <button
              className="btn btn-primary"
              onClick={handleSubmitExam}
            >
              Submit Exam
            </button>
          </div>
        </div>

        <div className="camera-section">
          <h3>Proctoring</h3>
          {cameraError ? (
            <div className="camera-error">
              <p>⚠️ {cameraError}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-preview"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <p className="camera-status">
                {cameraActive ? '🟢 Camera Active' : '🔴 Camera Inactive'}
              </p>
              <p className="camera-info">Screenshots captured every 30 seconds</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
