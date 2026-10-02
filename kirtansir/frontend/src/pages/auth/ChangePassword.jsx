import { useState } from 'react';
import axios from 'axios';
import { KeyRound } from 'lucide-react';

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:5000/api/auth/changepassword',
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="glass" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <KeyRound /> Change Password
      </h2>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
      {message && <div style={{ color: 'var(--accent)', marginBottom: '1rem' }}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Current Password</label>
          <input
            type="password"
            className="form-control"
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={6}
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
            minLength={6}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Update Password
        </button>
      </form>
    </div>
  );
}
