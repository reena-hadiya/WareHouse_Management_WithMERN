import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading WMS...</div>;

  if (!user) return <Navigate to="/login" />;

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === 'Admin') return <Navigate to="/admin" />;
    if (user.role === 'Supervisor') return <Navigate to="/supervisor" />;
    return <Navigate to="/staff" />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-content animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
