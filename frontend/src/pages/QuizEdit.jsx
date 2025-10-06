import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const QuizEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [quiz, setQuiz] = useState(null);
  
  const [questionData, setQuestionData] = useState({
    text: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    marks: 1,
    type: 'single-choice',
    explanation: ''
  });

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quizzes/${id}`);
      setQuiz(response.data.data);
    } catch (err) {
      setError('Failed to load quiz');
      console.error('Error fetching quiz:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuestionData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const updateOption = (index, value) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData({ ...questionData, options: newOptions });
  };

  const addOption = () => {
    if (questionData.options.length < 6) {
      setQuestionData({
        ...questionData,
        options: [...questionData.options, '']
      });
    }
  };

  const removeOption = (index) => {
    if (questionData.options.length > 2) {
      const newOptions = questionData.options.filter((_, i) => i !== index);
      setQuestionData({
        ...questionData,
        options: newOptions,
        correctOptionIndex: questionData.correctOptionIndex >= newOptions.length ? 0 : questionData.correctOptionIndex
      });
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Filter out empty options
      const filteredOptions = questionData.options.filter(opt => opt.trim() !== '');
      
      if (filteredOptions.length < 2) {
        setError('At least 2 options are required');
        setLoading(false);
        return;
      }

      if (!questionData.text.trim()) {
        setError('Question text is required');
        setLoading(false);
        return;
      }

      const dataToSend = {
        ...questionData,
        options: filteredOptions,
        correctOptionIndex: questionData.correctOptionIndex >= filteredOptions.length ? 0 : questionData.correctOptionIndex
      };

      await api.post(`/quizzes/${id}/questions`, dataToSend);
      setSuccess('Question added successfully!');
      
      // Reset form
      setQuestionData({
        text: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        marks: 1,
        type: 'single-choice',
        explanation: ''
      });

      // Refresh quiz data
      fetchQuiz();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add question');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishQuiz = () => {
    navigate('/my-quizzes');
  };

  if (!user) {
    return (
      <div className="card">
        <h2>Please Login</h2>
        <p>You need to be logged in to edit quizzes.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    );
  }

  if (!user.role || user.role !== 'admin') {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>🚫 Access Denied</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          Only administrators can edit quizzes.
        </p>
        <div style={{ padding: '1rem', backgroundColor: 'var(--gray-100)', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>👤 Current User</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role || 'user'}</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/')}
          style={{ padding: '0.75rem 1.5rem' }}
        >
          🏠 Go Home
        </button>
      </div>
    );
  }

  if (!quiz) {
    return <div className="card">Loading quiz...</div>;
  }

  return (
    <div className="quiz-edit-container">
      <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            📝 Edit Quiz: {quiz.title}
          </h1>
          <p style={{ color: 'var(--gray-600)' }}>
            {quiz.description}
          </p>
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--gray-100)', borderRadius: '8px' }}>
            <p><strong>Questions added:</strong> {quiz.questions?.length || 0}</p>
            <p><strong>Topic:</strong> {quiz.topic}</p>
            <p><strong>Difficulty:</strong> {quiz.difficulty}</p>
          </div>
        </div>

        {error && (
          <div className="error-message" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="success-message" style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'var(--success-light)', color: 'var(--success)', borderRadius: '8px' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleAddQuestion}>
          {/* Question Text */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Question Text *
            </label>
            <textarea
              name="text"
              value={questionData.text}
              onChange={handleInputChange}
              placeholder="Enter your question here..."
              rows="3"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--gray-300)', borderRadius: '8px', resize: 'vertical' }}
              required
            />
          </div>

          {/* Options */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Answer Options *
            </label>
            {questionData.options.map((option, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem' }}>
                <input
                  type="radio"
                  name="correctOption"
                  checked={questionData.correctOptionIndex === index}
                  onChange={() => setQuestionData({ ...questionData, correctOptionIndex: index })}
                  style={{ marginRight: '0.5rem' }}
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  style={{ flex: 1, padding: '0.5rem', border: '1px solid var(--gray-300)', borderRadius: '4px' }}
                />
                {questionData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    style={{ padding: '0.5rem', backgroundColor: 'var(--danger)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {questionData.options.length < 6 && (
              <button
                type="button"
                onClick={addOption}
                style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--gray-200)', border: '1px solid var(--gray-300)', borderRadius: '4px', cursor: 'pointer' }}
              >
                + Add Option
              </button>
            )}
          </div>

          {/* Question Settings */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Question Type
              </label>
              <select
                name="type"
                value={questionData.type}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--gray-300)', borderRadius: '8px' }}
              >
                <option value="single-choice">Single Choice</option>
                <option value="multi-choice">Multiple Choice</option>
                <option value="text">Text Answer</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Marks
              </label>
              <input
                type="number"
                name="marks"
                value={questionData.marks}
                onChange={handleInputChange}
                min="1"
                max="10"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--gray-300)', borderRadius: '8px' }}
              />
            </div>
          </div>

          {/* Explanation */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Explanation (Optional)
            </label>
            <textarea
              name="explanation"
              value={questionData.explanation}
              onChange={handleInputChange}
              placeholder="Explain why this answer is correct..."
              rows="2"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--gray-300)', borderRadius: '8px', resize: 'vertical' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                backgroundColor: loading ? 'var(--gray-400)' : 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '⏳ Adding...' : '➕ Add Question'}
            </button>

            <button
              type="button"
              onClick={handleFinishQuiz}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                backgroundColor: 'var(--success)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              ✅ Finish Quiz
            </button>

            <button
              type="button"
              onClick={() => navigate('/my-quizzes')}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                backgroundColor: 'var(--gray-500)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              📋 My Quizzes
            </button>
          </div>
        </form>

        {/* Current Questions Display */}
        {quiz.questions && quiz.questions.length > 0 && (
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--gray-50)', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Current Questions ({quiz.questions.length})</h3>
            {quiz.questions.map((q, index) => (
              <div key={index} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--gray-200)' }}>
                <h4><strong>Q{index + 1}:</strong> {q.text}</h4>
                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                  {q.options.map((opt, i) => (
                    <li key={i} style={{ 
                      color: q.correctOptionIndex === i ? 'var(--success)' : 'inherit',
                      fontWeight: q.correctOptionIndex === i ? 'bold' : 'normal'
                    }}>
                      {opt} {q.correctOptionIndex === i && '✓'}
                    </li>
                  ))}
                </ul>
                {q.explanation && (
                  <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: 'var(--gray-600)' }}>
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizEdit;
