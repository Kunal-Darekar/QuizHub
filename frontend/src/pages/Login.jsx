import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@example.com');
      setPassword('');
    } else {
      setEmail('user@example.com');
      setPassword('');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <div className="card">
        <h2 className="text-center mb-3" style={{ fontSize: '1.875rem', fontWeight: '700' }}>
          Login to QuizApp
        </h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '500' }}>
              Register here
            </Link>
          </p>

          <div style={{ 
            borderTop: '1px solid var(--gray-200)', 
            paddingTop: '1rem',
            marginTop: '1rem'
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.75rem' }}>
              Quick login (dev only):
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => quickLogin('admin')}
                style={{ flex: 1, fontSize: '0.875rem' }}
              >
                Admin
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => quickLogin('user')}
                style={{ flex: 1, fontSize: '0.875rem' }}
              >
                User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;