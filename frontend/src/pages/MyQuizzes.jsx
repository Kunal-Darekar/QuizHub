import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const MyQuizzes = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('attempts');

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      if (isAdmin) {
        // For admins, fetch both attempts and created quizzes
        const [attemptsRes, quizzesRes] = await Promise.all([
          api.get('/quizzes/my-attempts').catch(() => ({ data: { data: [] } })),
          api.get('/quizzes').then(res => ({
            data: { data: res.data.data.filter(quiz => quiz.createdBy && quiz.createdBy._id === user.id) }
          })).catch(() => ({ data: { data: [] } }))
        ]);
        setAttempts(attemptsRes.data.data || []);
        setCreatedQuizzes(quizzesRes.data.data || []);
      } else {
        // For regular users, only fetch attempts
        try {
          const response = await api.get('/quizzes/my-attempts');
          setAttempts(response.data.data || []);
        } catch (err) {
          console.log('Error fetching attempts:', err);
          setAttempts([]);
        }
      }
    } catch (err) {
      setError('Failed to load your data');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'var(--success)';
    if (percentage >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getStatistics = () => {
    if (attempts.length === 0) return null;
    
    const totalAttempts = attempts.length;
    const totalScore = attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
    const totalPossible = attempts.reduce((sum, attempt) => sum + (attempt.totalQuestions || 0), 0);
    const averagePercentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
    
    const excellentCount = attempts.filter(a => ((a.score || 0) / (a.totalQuestions || 1)) >= 0.8).length;
    const goodCount = attempts.filter(a => {
      const perc = (a.score || 0) / (a.totalQuestions || 1);
      return perc >= 0.6 && perc < 0.8;
    }).length;
    const needsImprovementCount = attempts.filter(a => ((a.score || 0) / (a.totalQuestions || 1)) < 0.6).length;

    return {
      totalAttempts,
      averagePercentage,
      excellentCount,
      goodCount,
      needsImprovementCount
    };
  };

  if (!user) {
    return (
      <div className="card">
        <h2>Please Login</h2>
        <p>You need to be logged in to view your quiz history.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading your quiz data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-4">
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          📚 My Quiz Dashboard
        </h1>
        <p style={{ color: 'var(--gray-600)', fontSize: '1.125rem' }}>
          {isAdmin ? 'Manage your quizzes and view your attempts' : 'Track your quiz progress and results'}
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Tab Navigation for Admins */}
      {isAdmin && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '2rem',
          borderBottom: '1px solid var(--gray-300)'
        }}>
          <button
            onClick={() => setActiveTab('attempts')}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === 'attempts' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'attempts' ? 'var(--primary)' : 'var(--gray-600)',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📊 My Quiz Attempts
          </button>
          <button
            onClick={() => setActiveTab('created')}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === 'created' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'created' ? 'var(--primary)' : 'var(--gray-600)',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            👑 Created Quizzes ({createdQuizzes.length})
          </button>
        </div>
      )}

      {/* Admin Create Quiz Button */}
      {isAdmin && activeTab === 'created' && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/create-quiz')}
            style={{ 
              fontSize: '1.1rem', 
              padding: '0.75rem 2rem',
              fontWeight: '600'
            }}
          >
            ➕ Create New Quiz
          </button>
        </div>
      )}

      {/* Content based on tab or user type */}
      {(!isAdmin || activeTab === 'attempts') && (
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>📊 Quiz Attempts</h2>
          
          {/* Statistics Dashboard */}
          {getStatistics() && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem', 
              marginBottom: '2rem' 
            }}>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--primary-light)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  {getStatistics().totalAttempts}
                </div>
                <div style={{ color: 'var(--gray-600)', fontWeight: '600' }}>Total Quizzes Taken</div>
              </div>
              
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: getScoreColor(getStatistics().averagePercentage, 100) === 'var(--success)' ? 'var(--success-light)' : getScoreColor(getStatistics().averagePercentage, 100) === 'var(--warning)' ? 'var(--warning-light)' : 'var(--danger-light)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getScoreColor(getStatistics().averagePercentage, 100) }}>
                  {getStatistics().averagePercentage}%
                </div>
                <div style={{ color: 'var(--gray-600)', fontWeight: '600' }}>Average Score</div>
              </div>
              
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--success-light)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                  {getStatistics().excellentCount}
                </div>
                <div style={{ color: 'var(--gray-600)', fontWeight: '600' }}>Excellent (80%+)</div>
              </div>
              
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--warning-light)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                  {getStatistics().goodCount}
                </div>
                <div style={{ color: 'var(--gray-600)', fontWeight: '600' }}>Good (60-79%)</div>
              </div>
              
              {getStatistics().needsImprovementCount > 0 && (
                <div className="card" style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--danger-light)' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--danger)' }}>
                    {getStatistics().needsImprovementCount}
                  </div>
                  <div style={{ color: 'var(--gray-600)', fontWeight: '600' }}>Needs Practice</div>
                </div>
              )}
            </div>
          )}
          {attempts.length === 0 ? (
            <div className="card text-center">
              <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>🎯 No Quiz Attempts Yet</h3>
              <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
                Start taking quizzes to track your progress and improve your knowledge!
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/')}
                style={{ padding: '0.75rem 1.5rem' }}
              >
                🚀 Browse Available Quizzes
              </button>
            </div>
          ) : (
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--gray-700)' }}>📋 Recent Quiz Attempts</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {attempts.map((attempt, index) => (
                <div key={attempt._id || index} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>
                        {attempt.quiz?.title || 'Quiz Title'}
                      </h3>
                      <p style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
                        📅 {formatDate(attempt.completedAt || attempt.createdAt)}
                      </p>
                      <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                        🏷️ {attempt.quiz?.topic || 'General'} • {attempt.quiz?.difficulty || 'Medium'}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold',
                        color: getScoreColor(attempt.score || 0, attempt.totalQuestions || 1)
                      }}>
                        {attempt.score || 0}/{attempt.totalQuestions || 0}
                      </div>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: getScoreColor(attempt.score || 0, attempt.totalQuestions || 1)
                      }}>
                        {Math.round(((attempt.score || 0) / (attempt.totalQuestions || 1)) * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ 
                      flex: 1, 
                      backgroundColor: 'var(--gray-200)', 
                      borderRadius: '10px', 
                      height: '8px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${((attempt.score || 0) / (attempt.totalQuestions || 1)) * 100}%`,
                        height: '100%',
                        backgroundColor: getScoreColor(attempt.score || 0, attempt.totalQuestions || 1),
                        borderRadius: '10px'
                      }} />
                    </div>
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate(`/result/${attempt._id}`)}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    >
                      📋 View Details
                    </button>
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Admin Created Quizzes Tab */}
      {isAdmin && activeTab === 'created' && (
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>👑 Your Created Quizzes</h2>
          {createdQuizzes.length === 0 ? (
            <div className="card text-center">
              <h3 style={{ marginBottom: '1rem' }}>No Quizzes Created Yet</h3>
              <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
                Start creating your first quiz using our AI-powered quiz generator!
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/create-quiz')}
              >
                🚀 Create Your First Quiz
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {createdQuizzes.map((quiz) => (
                <div key={quiz._id} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>
                        {quiz.title}
                      </h3>
                      <p style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
                        {quiz.description}
                      </p>
                      <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                        🏷️ {quiz.topic} • {quiz.difficulty} • {quiz.questions?.length || 0} questions
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => navigate(`/quiz/${quiz._id}/edit`)}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/quiz/${quiz._id}`)}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                      >
                        👁️ Preview
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyQuizzes;
