import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Staff');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass auth-card animate-fade-in">
        <h2>Create an Account</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-control" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter your full name" 
              autoComplete="new-name"
            />
          </div>
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
              minLength={6} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Create a password"
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Staff">Warehouse Staff</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            <UserPlus size={20} /> Register
          </button>
        </form>

        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}
