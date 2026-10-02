import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      borderBottom: '1px solid var(--surface-border)',
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <h2 style={{ color: 'var(--primary)' }}>WMS</h2>
        <span style={{ color: 'var(--text-muted)' }}>| {user?.role} Panel</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <User size={18} />
          <span>{user?.name}</span>
        </div>
        <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: 'var(--danger)', padding: '0.5rem 1rem' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
}
