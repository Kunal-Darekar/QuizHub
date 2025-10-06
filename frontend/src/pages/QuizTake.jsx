import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';

const QuizTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [startTime] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchQuiz();
  }, [id, user, navigate]);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quizzes/${id}`);
      const quizData = response.data.data.quiz;
      setQuiz(quizData);
      setQuestions(response.data.data.questions);
      
      // Initialize timer if quiz has time limit
      if (quizData.timeLimit && quizData.timeLimit > 0) {
        setTimeRemaining(quizData.timeLimit * 60); // Convert minutes to seconds
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }
      setError('Failed to load quiz. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || timerExpired || submitting) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, timerExpired, submitting]);

  // Auto-submit when timer expires
  useEffect(() => {
    if (timerExpired && !submitting) {
      handleSubmit();
    }
  }, [timerExpired, submitting]);

  // Format time for display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (answer) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex]._id]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const unanswered = questions.filter(q => !(q._id in answers));
    if (unanswered.length > 0) {
      const confirm = window.confirm(
        `You have ${unanswered.length} unanswered question(s). Submit anyway?`
      );
      if (!confirm) return;
    }

    setSubmitting(true);

    try {
      const formattedAnswers = questions.map(q => ({
        questionId: q._id,
        answer: answers[q._id] !== undefined ? answers[q._id] : null
      }));

      const response = await api.post(`/quizzes/${id}/submit`, {
        answers: formattedAnswers,
        startedAt: startTime.toISOString()
      });

      navigate(`/result/${response.data.data.attemptId}`);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }
      setError('Failed to submit quiz. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="card text-center">
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>🔐 Login Required</h3>
        <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
          Please login to take this quiz.
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/login')}
        >
          Login to Continue
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="card">
        <h2>Quiz not found</h2>
        <p>This quiz doesn't exist or has no questions.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card mb-3">
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          {quiz.title}
        </h1>
        <p style={{ color: 'var(--gray-600)' }}>{quiz.description}</p>
        
        {timeRemaining !== null && (
          <div style={{ 
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: timeRemaining <= 300 ? '#fee' : timeRemaining <= 600 ? '#fff3cd' : '#e3f2fd',
            border: `1px solid ${timeRemaining <= 300 ? '#fcc' : timeRemaining <= 600 ? '#ffeaa7' : '#bbdefb'}`,
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600',
              color: timeRemaining <= 300 ? '#c33' : timeRemaining <= 600 ? '#856404' : '#1976d2'
            }}>
              ⏰ Time Remaining: {formatTime(timeRemaining)}
            </div>
            {timeRemaining <= 300 && (
              <div style={{ fontSize: '0.875rem', color: '#c33', marginTop: '0.25rem' }}>
                ⚠️ Less than 5 minutes remaining!
              </div>
            )}
            {timerExpired && (
              <div style={{ fontSize: '0.875rem', color: '#c33', marginTop: '0.25rem' }}>
                ⏰ Time's up! Auto-submitting...
              </div>
            )}
          </div>
        )}
      </div>

      <div className="question-progress">
        <div style={{ marginBottom: '0.5rem' }}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div style={{ 
          width: '100%', 
          height: '8px', 
          background: 'var(--gray-200)', 
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'var(--primary)',
            transition: 'width 0.3s'
          }}></div>
        </div>
      </div>

      <QuestionCard
        question={currentQuestion}
        answer={answers[currentQuestion._id]}
        onAnswerChange={handleAnswerChange}
      />

      <div className="question-nav">
        <button
          className="btn btn-secondary"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          ← Previous
        </button>

        {currentQuestionIndex === questions.length - 1 ? (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleNext}
          >
            Next →
          </button>
        )}
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: 'var(--gray-50)', 
        borderRadius: '0.5rem',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
          Answered: {Object.keys(answers).length} / {questions.length}
        </p>
      </div>
    </div>
  );
};

export default QuizTake;
