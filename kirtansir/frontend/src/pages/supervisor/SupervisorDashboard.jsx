import { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardCheck, BarChart2, CheckSquare, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SupervisorDashboard() {
  const [operations, setOperations] = useState({ incoming: [], outgoing: [] });

  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/supervisor/operations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOperations(res.data);
      } catch (err) {
        console.error('Failed to fetch operations', err);
      }
    };
    fetchOperations();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Supervisor Operations Center</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Link to="/supervisor/approvals" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="glass stat-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}><CheckSquare size={24} /></div>
            <div className="stat-info">
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>Approve</h3>
              <p>Dispatch Requests</p>
            </div>
          </div>
        </Link>

        <Link to="/supervisor/inventory" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="glass stat-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}><BarChart2 size={24} /></div>
            <div className="stat-info">
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>Reports</h3>
              <p>View Inventory</p>
            </div>
          </div>
        </Link>

        <Link to="/supervisor/storage" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="glass stat-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}><Layers size={24} /></div>
            <div className="stat-info">
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>Allocate</h3>
              <p>Storage Management</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="glass" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ClipboardCheck /> Monitor Warehouse Operations
        </h2>

        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--accent)' }}>Recent Incoming Operations</h3>
        <div className="table-container" style={{ marginBottom: '2rem' }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Handled By Staff</th>
              </tr>
            </thead>
            <tbody>
              {operations.incoming.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No incoming operations.</td></tr>
              ) : (
                operations.incoming.slice(0, 5).map(s => (
                  <tr key={s._id}>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td>{s.quantity}</td>
                    <td>{s.status}</td>
                    <td>{s.handledBy?.name || 'Unknown'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--primary)' }}>Recent Outgoing / Dispatch</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Handled By Staff</th>
              </tr>
            </thead>
            <tbody>
              {operations.outgoing.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No outgoing operations.</td></tr>
              ) : (
                operations.outgoing.slice(0, 5).map(s => (
                  <tr key={s._id}>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td>{s.quantity}</td>
                    <td>
                      <strong style={{ color: s.status === 'Pending' ? 'var(--warning)' : 'var(--accent)' }}>
                        {s.status}
                      </strong>
                    </td>
                    <td>{s.handledBy?.name || 'Unknown'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
