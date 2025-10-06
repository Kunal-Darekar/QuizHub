import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('create'); // 'create', 'ai-generate', 'manual-add'
  
  // Quiz creation state
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    topic: '',
    difficulty: 'medium',
    timeLimit: 20
  });

  // Question creation state
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [questionData, setQuestionData] = useState({
    text: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    marks: 1,
    type: 'single-choice',
    explanation: ''
  });

  // AI generation state
  const [generatorData, setGeneratorData] = useState({
    topic: '',
    numQuestions: 5,
    difficulty: 'medium'
  });
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [draftQuizzes, setDraftQuizzes] = useState([]);

  const popularTopics = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'HTML/CSS',
    'Database', 'Data Structures', 'Algorithms', 'Machine Learning', 'AI',
    'Web Development', 'Mobile Development', 'DevOps', 'Cybersecurity',
    'Cloud Computing', 'Blockchain', 'UI/UX Design', 'Project Management'
  ];

  const showMessage = (type, text) => {
    if (type === 'error') {
      setError(text);
      setSuccess('');
    } else {
      setSuccess(text);
      setError('');
    }
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuizData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTopicSelect = (topic) => {
    setQuizData(prev => ({ ...prev, topic }));
  };

  // Fetch draft quizzes
  const fetchDraftQuizzes = async () => {
    try {
      const response = await api.get('/quizzes?status=draft');
      setDraftQuizzes(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch draft quizzes:', err);
    }
  };

  // Load draft quizzes on component mount
  useEffect(() => {
    if (isAdmin) {
      fetchDraftQuizzes();
    }
  }, [isAdmin]);

  // Continue working on a draft quiz
  const handleContinueDraft = (draftQuiz) => {
    setSelectedQuizId(draftQuiz._id);
    setQuizData({
      title: draftQuiz.title,
      description: draftQuiz.description,
      topic: draftQuiz.topic,
      difficulty: draftQuiz.difficulty,
      timeLimit: draftQuiz.timeLimit
    });
    setActiveTab('ai-generate');
    showMessage('success', `Continuing work on "${draftQuiz.title}"`);
  };

  // Create Quiz
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create quiz as draft initially
      const quizPayload = {
        ...quizData,
        status: 'draft' // Mark as draft until questions are added
      };
      
      const response = await api.post('/quizzes', quizPayload);
      showMessage('success', `Quiz draft created! Add questions to complete it. ID: ${response.data.data._id}`);
      setSelectedQuizId(response.data.data._id);
      setQuizData({
        title: '',
        description: '',
        topic: '',
        difficulty: 'medium',
        timeLimit: 20
      });
      setActiveTab('ai-generate'); // Switch to AI generation tab
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  // Generate Questions with AI
  const handleGenerateQuestions = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setGeneratedQuestions([]);

    try {
      const response = await api.post('/generate-questions', generatorData);
      setGeneratedQuestions(response.data.data.questions);
      showMessage('success', `Generated ${response.data.data.questions.length} questions using ${response.data.data.provider}!`);
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to generate questions');
    } finally {
      setGenerating(false);
    }
  };

  // Publish quiz (change from draft to published)
  const publishQuiz = async (quizId) => {
    try {
      await api.patch(`/quizzes/${quizId}`, { status: 'published' });
      showMessage('success', 'Quiz published successfully!');
    } catch (err) {
      console.error('Failed to publish quiz:', err);
    }
  };

  // Save generated question to database
  const handleSaveGeneratedQuestion = async (question) => {
    if (!selectedQuizId) {
      showMessage('error', 'Please create a quiz first');
      return;
    }

    try {
      await api.post(`/quizzes/${selectedQuizId}/questions`, question);
      showMessage('success', 'Question saved!');
      setGeneratedQuestions(generatedQuestions.filter(q => q !== question));
      
      // Auto-publish quiz when first question is added
      await publishQuiz(selectedQuizId);
    } catch (err) {
      showMessage('error', 'Failed to save question');
    }
  };

  // Add Question Manually
  const handleAddQuestion = async (e) => {
    e.preventDefault();

    if (!selectedQuizId) {
      showMessage('error', 'Please create a quiz first');
      return;
    }

    setLoading(true);

    try {
      // Filter out empty options
      const filteredOptions = questionData.options.filter(opt => opt.trim() !== '');
      
      if (filteredOptions.length < 2) {
        showMessage('error', 'At least 2 options are required');
        setLoading(false);
        return;
      }

      const dataToSend = {
        ...questionData,
        options: filteredOptions,
        correctOptionIndex: questionData.type === 'multi-choice' 
          ? [questionData.correctOptionIndex]
          : questionData.correctOptionIndex
      };

      await api.post(`/quizzes/${selectedQuizId}/questions`, dataToSend);
      showMessage('success', 'Question added successfully!');
      
      // Auto-publish quiz when first question is added
      await publishQuiz(selectedQuizId);
      
      // Reset form
      setQuestionData({
        text: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        marks: 1,
        type: 'single-choice',
        explanation: ''
      });
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to add question');
    } finally {
      setLoading(false);
    }
  };

  // Update option in question form
  const updateOption = (index, value) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData({ ...questionData, options: newOptions });
  };

  if (!user) {
    return (
      <div className="card">
        <h2>Please Login</h2>
        <p>You need to be logged in to access this page.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>🚫 Access Denied</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          Only administrators can create quizzes.
        </p>
        <div style={{ padding: '1rem', backgroundColor: 'var(--gray-100)', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>👤 Current User</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role || 'user'}</p>
        </div>
        <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
          Please contact an administrator to get admin access or take existing quizzes.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/')}
            style={{ padding: '0.75rem 1.5rem' }}
          >
            🏠 Go Home
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/my-quizzes')}
            style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--gray-500)' }}
          >
            📋 My Quiz Attempts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-quiz-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '2rem', textAlign: 'center' }}>
        🎯 Quiz Creator Dashboard
      </h1>

      {error && (
        <div className="error-message" style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fee', color: '#c33', borderRadius: '8px', border: '1px solid #fcc' }}>
          {error}
        </div>
      )}

      {success && (
        <div className="success-message" style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#efe', color: '#363', borderRadius: '8px', border: '1px solid #cfc' }}>
          {success}
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ marginBottom: '2rem', borderBottom: '2px solid #eee' }}>
        <div style={{ display: 'flex', gap: '0' }}>
          <button
            onClick={() => setActiveTab('create')}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              backgroundColor: activeTab === 'create' ? '#007bff' : 'transparent',
              color: activeTab === 'create' ? 'white' : '#666',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: '600',
              borderBottom: activeTab === 'create' ? '3px solid #007bff' : '3px solid transparent'
            }}
          >
            Create Quiz
          </button>
          <button
            onClick={() => setActiveTab('ai-generate')}
            disabled={!selectedQuizId}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              backgroundColor: activeTab === 'ai-generate' ? '#007bff' : 'transparent',
              color: activeTab === 'ai-generate' ? 'white' : (!selectedQuizId ? '#ccc' : '#666'),
              borderRadius: '8px 8px 0 0',
              cursor: !selectedQuizId ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              borderBottom: activeTab === 'ai-generate' ? '3px solid #007bff' : '3px solid transparent'
            }}
          >
            AI Generate Questions
          </button>
          <button
            onClick={() => setActiveTab('manual-add')}
            disabled={!selectedQuizId}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              backgroundColor: activeTab === 'manual-add' ? '#007bff' : 'transparent',
              color: activeTab === 'manual-add' ? 'white' : (!selectedQuizId ? '#ccc' : '#666'),
              borderRadius: '8px 8px 0 0',
              cursor: !selectedQuizId ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              borderBottom: activeTab === 'manual-add' ? '3px solid #007bff' : '3px solid transparent'
            }}
          >
            Add Questions Manually
          </button>
        </div>
      </div>

      {draftQuizzes.length > 0 && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7' }}>
          <h3 style={{ marginBottom: '1rem', color: '#856404' }}>📝 Continue Working on Draft Quizzes</h3>
          <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#856404' }}>
            You have {draftQuizzes.length} incomplete quiz(s) that need questions added.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {draftQuizzes.map(draft => (
              <div key={draft._id} style={{ 
                padding: '1rem', 
                backgroundColor: 'white', 
                border: '1px solid #ddd', 
                borderRadius: '8px' 
              }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{draft.title}</h4>
                <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                  Topic: {draft.topic} | Difficulty: {draft.difficulty}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '1rem' }}>
                  Created: {new Date(draft.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleContinueDraft(draft)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  ➡️ Continue Adding Questions
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Create New Quiz</h2>
          <form onSubmit={handleCreateQuiz}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Quiz Title *
              </label>
              <input
                type="text"
                name="title"
                value={quizData.title}
                onChange={handleInputChange}
                placeholder="e.g., JavaScript Fundamentals Quiz"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Description
              </label>
              <textarea
                name="description"
                value={quizData.description}
                onChange={handleInputChange}
                placeholder="Brief description of what this quiz covers..."
                rows="3"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Topic *
              </label>
              <input
                type="text"
                name="topic"
                value={quizData.topic}
                onChange={handleInputChange}
                placeholder="Enter your topic or select from popular topics below"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}
                required
              />
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {popularTopics.map(topic => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleTopicSelect(topic)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: quizData.topic === topic ? '2px solid #007bff' : '1px solid #ddd',
                      borderRadius: '20px',
                      backgroundColor: quizData.topic === topic ? '#e3f2fd' : 'white',
                      color: quizData.topic === topic ? '#007bff' : '#666',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={quizData.difficulty}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  name="timeLimit"
                  value={quizData.timeLimit}
                  onChange={handleInputChange}
                  min="5"
                  max="120"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  backgroundColor: loading ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  minWidth: '200px'
                }}
              >
                {loading ? '🔄 Creating...' : '📝 Create Quiz'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'ai-generate' && (
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>🤖 AI Question Generator</h2>
          {selectedQuizId && (
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
              <strong>Current Quiz ID:</strong> {selectedQuizId}
            </div>
          )}
          
          <form onSubmit={handleGenerateQuestions}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Topic</label>
                <input
                  type="text"
                  value={generatorData.topic}
                  onChange={(e) => setGeneratorData({ ...generatorData, topic: e.target.value })}
                  placeholder="e.g., Python Lists"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Number of Questions</label>
                <input
                  type="number"
                  value={generatorData.numQuestions}
                  onChange={(e) => setGeneratorData({ ...generatorData, numQuestions: parseInt(e.target.value) })}
                  min="1"
                  max="10"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Difficulty</label>
                <select
                  value={generatorData.difficulty}
                  onChange={(e) => setGeneratorData({ ...generatorData, difficulty: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={generating}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: '600',
                backgroundColor: generating ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: generating ? 'not-allowed' : 'pointer'
              }}
            >
              {generating ? '🔄 Generating...' : '🤖 Generate Questions'}
            </button>
          </form>

          {generatedQuestions.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Generated Questions ({generatedQuestions.length})</h3>
              {generatedQuestions.map((q, index) => (
                <div key={index} style={{ marginBottom: '1.5rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                  <h4 style={{ marginBottom: '1rem' }}><strong>Q{index + 1}:</strong> {q.text}</h4>
                  <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                    {q.options.map((opt, i) => (
                      <li key={i} style={{ 
                        color: (Array.isArray(q.correctOptionIndex) ? q.correctOptionIndex.includes(i) : q.correctOptionIndex === i) 
                          ? '#28a745' 
                          : 'inherit',
                        fontWeight: (Array.isArray(q.correctOptionIndex) ? q.correctOptionIndex.includes(i) : q.correctOptionIndex === i)
                          ? '600' 
                          : 'normal',
                        marginBottom: '0.5rem'
                      }}>
                        {opt}
                      </li>
                    ))}
                  </ul>
                  {q.explanation && (
                    <p style={{ 
                      marginBottom: '1rem', 
                      fontSize: '0.875rem', 
                      color: '#666',
                      fontStyle: 'italic',
                      backgroundColor: '#fff',
                      padding: '0.5rem',
                      borderRadius: '4px'
                    }}>
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => handleSaveGeneratedQuestion(q)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      💾 Save to Quiz
                    </button>
                    <button
                      onClick={() => setGeneratedQuestions(generatedQuestions.filter(q2 => q2 !== q))}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Discard
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'manual-add' && (
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>✏️ Add Question Manually</h2>
          {selectedQuizId && (
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
              <strong>Adding to Quiz ID:</strong> {selectedQuizId}
            </div>
          )}

          <form onSubmit={handleAddQuestion}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Question Text *</label>
              <textarea
                value={questionData.text}
                onChange={(e) => setQuestionData({ ...questionData, text: e.target.value })}
                placeholder="Enter your question"
                rows="3"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', resize: 'vertical' }}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Question Type</label>
              <select
                value={questionData.type}
                onChange={(e) => setQuestionData({ ...questionData, type: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }}
              >
                <option value="single-choice">Single Choice</option>
                <option value="multi-choice">Multiple Choice</option>
                <option value="text">Text Answer</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Options</label>
              {questionData.options.map((opt, index) => (
                <input
                  key={index}
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '0.5rem' }}
                />
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Correct Option Index (0-based)</label>
                <input
                  type="number"
                  value={questionData.correctOptionIndex}
                  onChange={(e) => setQuestionData({ ...questionData, correctOptionIndex: parseInt(e.target.value) })}
                  min="0"
                  max={questionData.options.length - 1}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Marks</label>
                <input
                  type="number"
                  value={questionData.marks}
                  onChange={(e) => setQuestionData({ ...questionData, marks: parseInt(e.target.value) })}
                  min="1"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Explanation (optional)</label>
              <input
                type="text"
                value={questionData.explanation}
                onChange={(e) => setQuestionData({ ...questionData, explanation: e.target.value })}
                placeholder="Brief explanation of the answer"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: '600',
                backgroundColor: loading ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '🔄 Adding...' : '✏️ Add Question'}
            </button>
          </form>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          onClick={() => navigate('/my-quizzes')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          📋 View My Quizzes
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          🏠 Go Home
        </button>
      </div>
    </div>
  );
};

export default CreateQuiz;