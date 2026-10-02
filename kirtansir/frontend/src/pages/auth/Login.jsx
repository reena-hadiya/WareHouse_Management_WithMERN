import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const user = await login(email, password);
      // Redirect based on role
      if (user.role === 'Admin') navigate('/admin');
      else if (user.role === 'Supervisor') navigate('/supervisor');
      else navigate('/staff');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass auth-card animate-fade-in">
        <h2 style={{ textAlign: 'center' }}>Welcome Back</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              autoComplete="new-email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            <LogIn size={20} /> Login
          </button>
        </form>

        <div className="auth-links" style={{ textAlign: 'center' }}>
          <p><Link to="/forgot-password">Forgot your password?</Link></p>
          <p style={{ marginTop: '0.5rem' }}>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
}
