import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;

    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/auth/resetpassword/${token}`, { password });
      setMessage(res.data.message || 'Password reset successful. You can log in now.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link might have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass auth-card animate-fade-in" style={{ maxWidth: '450px', width: '100%' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Set New Password</h2>
        
        {message ? (
           <div style={{ textAlign: 'center', padding: '2rem 0' }}>
             <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
               <CheckCircle2 size={64} style={{ color: 'var(--success, #10b981)' }} />
             </div>
             <h3 style={{ marginBottom: '1rem', color: 'var(--success, #10b981)' }}>Success!</h3>
             <p style={{ color: 'var(--text-muted)' }}>{message}</p>
             <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '2rem' }}>Redirecting to login...</p>
           </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.95rem' }}>
              Your new password must be different from previous used passwords.
            </p>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  minLength={6}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  minLength={6}
                  disabled={isSubmitting}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting}
                style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Resetting...</span>
                ) : (
                  <>
                    <Lock size={18} /> Reset Password
                  </>
                )}
              </button>
            </form>
            <div className="auth-links" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>
                <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'none' }}>Back to Login</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
