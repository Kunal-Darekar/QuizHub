import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import QuizCard from '../components/QuizCard';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchQuizzes();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchQuizzes = async () => {
    try {
      const response = await api.get('/quizzes');
      setQuizzes(response.data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please login to view quizzes.');
      } else {
        setError('Failed to load quizzes. Please try again later.');
      }
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-4">
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Welcome to QuizApp
        </h1>
        <p style={{ color: 'var(--gray-600)', fontSize: '1.125rem' }}>
          Test your knowledge with our interactive quizzes
        </p>
        {user && isAdmin && (
          <div style={{ marginTop: '1.5rem' }}>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/create-quiz')}
              style={{ 
                fontSize: '1.1rem', 
                padding: '0.75rem 2rem',
                fontWeight: '600'
              }}
            >
👑 Create Quiz (Admin)
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {!user ? (
        <div className="card text-center">
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>🔐 Login Required</h3>
          <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
            Please login to view and take quizzes. Join our community of learners!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </button>
          </div>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="card text-center">
          <p style={{ color: 'var(--gray-600)' }}>
            No quizzes available yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;