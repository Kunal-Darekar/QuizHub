import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';

const Result = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAttempt();
  }, [attemptId, user, navigate]);

  const fetchAttempt = async () => {
    try {
      const response = await api.get(`/quizzes/attempts/${attemptId}`);
      setAttempt(response.data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }
      setError('Failed to load results. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading results...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!attempt) {
    return (
      <div className="card">
        <h2>Results not found</h2>
        <p>Unable to load quiz results.</p>
      </div>
    );
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'var(--success)';
    if (percentage >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'Excellent!';
    if (percentage >= 80) return 'Great Job!';
    if (percentage >= 70) return 'Good Work!';
    if (percentage >= 60) return 'Not Bad!';
    return 'Keep Practicing!';
  };

  return (
    <div className="result-container">
      <div className="score-card">
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Quiz Results
        </h1>
        <h2 style={{ color: 'var(--gray-600)', fontWeight: '400', marginBottom: '1.5rem' }}>
          {attempt.quiz?.title || attempt.quizId?.title || 'Quiz Results'}
        </h2>
        
        <div className="score-value" style={{ color: getScoreColor(attempt.percentage) }}>
          {attempt.percentage}%
        </div>
        <p style={{ fontSize: '1.25rem', color: 'var(--gray-700)', marginBottom: '1rem' }}>
          {getGrade(attempt.percentage)}
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          justifyContent: 'center',
          marginTop: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Score</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>
              {attempt.score} / {attempt.totalMarks}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Time Taken</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>
              {Math.floor(attempt.timeTaken / 60)}:{String(attempt.timeTaken % 60).padStart(2, '0')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Correct</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>
              {attempt.answers.filter(a => a.isCorrect).length} / {attempt.answers.length}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate(`/quiz/${attempt.quizId._id}`)}
          >
            Retake Quiz
          </button>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
        Detailed Review
      </h2>

      {attempt.answers.map((answer, index) => {
        const question = answer.questionId;
        if (!question) return null;

        return (
          <div key={answer._id || index} className={`question-result ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3 style={{ margin: 0 }}>Question {index + 1}</h3>
              <span style={{ 
                fontWeight: '600',
                color: answer.isCorrect ? 'var(--success)' : 'var(--danger)'
              }}>
                {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'} ({answer.marksAwarded}/{question.marks || 1})
              </span>
            </div>

            <QuestionCard
              question={{
                ...question,
                correctAnswer: answer.correctAnswer
              }}
              answer={answer.answer}
              onAnswerChange={() => {}}
              showResult={true}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Result;