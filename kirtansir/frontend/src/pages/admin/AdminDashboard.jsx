import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Database, FileText, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [data, setData] = useState({
    totalProducts: 0,
    lowStockProducts: [],
    totalShipments: 0,
    pendingShipments: 0,
    deliveredShipments: 0
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/warehouse-data', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch admin data', error);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Administration Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Link to="/admin/data" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="glass stat-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div className="stat-icon"><Database size={24} /></div>
            <div className="stat-info">
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>{data.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/data" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="glass stat-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}><FileText size={24} /></div>
            <div className="stat-info">
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>{data.totalShipments}</h3>
              <p>Total Shipments</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/data" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="glass stat-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)' }}><Settings size={24} /></div>
            <div className="stat-info">
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>{data.deliveredShipments}</h3>
              <p>Delivered</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/users" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="glass stat-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}><Users size={24} /></div>
            <div className="stat-info">
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>Manage</h3>
              <p>Personnel</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="glass" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>System Performance Overview</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Pending Shipments</td>
                <td>{data.pendingShipments}</td>
                <td>{data.pendingShipments > 0 ? <span style={{ color: 'var(--warning)' }}>Needs Attention</span> : <span style={{ color: 'var(--text-muted)' }}>Clear</span>}</td>
              </tr>
              <tr>
                <td>Low Stock Alerts</td>
                <td>{data.lowStockProducts.length}</td>
                <td>{data.lowStockProducts.length > 0 ? <span style={{ color: 'var(--danger)' }}>Critical</span> : <span style={{ color: 'var(--accent)' }}>Healthy</span>}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
