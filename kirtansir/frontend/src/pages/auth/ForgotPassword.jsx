import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Send, MailCheck, AlertCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgotpassword', { email });
      setSuccessData({
        message: res.data.message,
        resetLink: res.data.resetLink
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass auth-card animate-fade-in" style={{ maxWidth: '450px', width: '100%' }}>
        
        {!successData ? (
          <>
            <h2 style={{ marginBottom: '1.5rem' }}>Forgot Password</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.95rem' }}>
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
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
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    <Send size={18} /> Send Reset Instructions
                  </>
                )}
              </button>
            </form>

            <div className="auth-links" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>
                Remember your password? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'none' }}>Back to Login</Link>
              </p>
            </div>
          </>
        ) : (
          <div className="success-view animate-fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success, #10b981)', padding: '1rem', borderRadius: '50%' }}>
                <MailCheck size={48} />
              </div>
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', color: 'var(--text)' }}>Check your inbox</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
              We've sent password reset instructions to <br/>
              <strong style={{ color: 'var(--text)' }}>{email}</strong>
            </p>

            {/* Simulated Email / Demo Section */}
            {successData.resetLink && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1.5rem', 
                background: 'rgba(56, 189, 248, 0.05)', 
                border: '1px solid rgba(56, 189, 248, 0.2)', 
                borderRadius: '12px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent)', fontWeight: 'bold' }}>Simulation Mode Active</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                  In a real production environment, you would click the link sent to your email. For this demo, you can securely reset your password by clicking below:
                </p>
                <a 
                  href={successData.resetLink.replace('http://localhost:5173', '')} 
                  className="btn btn-primary" 
                  style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '0.75rem' }}
                >
                  Proceed to Reset Password
                </a>
              </div>
            )}

            <div style={{ marginTop: '2rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Didn't receive the email?{' '}
                <button 
                  onClick={() => { setSuccessData(null); setEmail(''); }} 
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}
                >
                  Try another email address
                </button>
              </p>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
                <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>
                    &larr; Return to log in
                </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
