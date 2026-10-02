import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, Truck, LayoutDashboard, Users, FileText, Settings, Archive, Database } from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();

  const getLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case 'Staff':
        return [
          { name: 'Dashboard', path: '/staff', icon: <LayoutDashboard size={20} /> },
          { name: 'Incoming Stock', path: '/staff/stock', icon: <Package size={20} /> },
          { name: 'Storage Locations', path: '/staff/storage', icon: <Archive size={20} /> },
          { name: 'Dispatch & Shipments', path: '/staff/shipments', icon: <Truck size={20} /> },
        ];
      case 'Supervisor':
        return [
          { name: 'Dashboard', path: '/supervisor', icon: <LayoutDashboard size={20} /> },
          { name: 'Approve Dispatch', path: '/supervisor/approvals', icon: <Truck size={20} /> },
          { name: 'Inventory Report', path: '/supervisor/inventory', icon: <FileText size={20} /> },
          { name: 'Manage Storage', path: '/supervisor/storage', icon: <Settings size={20} /> },
        ];
      case 'Admin':
        return [
          { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
          { name: 'Manage Personnel', path: '/admin/users', icon: <Users size={20} /> },
          { name: 'Warehouse Data', path: '/admin/data', icon: <Database size={20} /> },
          { name: 'Operational Reports', path: '/admin/reports', icon: <FileText size={20} /> },
          { name: 'Maintain Records', path: '/admin/records', icon: <Settings size={20} /> },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside style={{
      width: '260px',
      background: 'var(--surface)',
      borderRight: '1px solid var(--surface-border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1rem'
    }}>
      <div style={{ marginBottom: '2rem', paddingLeft: '1rem' }}>
        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Menu Navigation</h3>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              color: isActive ? 'white' : 'var(--text-muted)',
              background: isActive ? 'var(--primary)' : 'transparent',
              textDecoration: 'none',
              transition: 'background 0.2s, color 0.2s',
            })}
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
