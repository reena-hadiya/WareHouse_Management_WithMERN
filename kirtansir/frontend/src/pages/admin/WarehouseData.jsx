import { useState, useEffect } from 'react';
import axios from 'axios';
import { Database } from 'lucide-react';

export default function WarehouseData() {
  const [data, setData] = useState(null);

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

  if (!data) return <div style={{ padding: '2rem' }}>Loading data...</div>;

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Database /> Global Warehouse Data
      </h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ flex: 1, minWidth: '300px', background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Shipment Statistics</h3>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Processed:</span> <strong>{data.totalShipments}</strong>
            </li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Pending Approvals:</span> <strong style={{ color: 'var(--warning)' }}>{data.pendingShipments}</strong>
            </li>
            <li style={{ padding: '0.5rem 0', display: 'flex', justifyContent: 'space-between' }}>
              <span>Successfully Delivered:</span> <strong style={{ color: 'var(--accent)' }}>{data.deliveredShipments}</strong>
            </li>
          </ul>
        </div>

        <div style={{ flex: 1, minWidth: '300px', background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Low Stock Alerts ({data.lowStockProducts.length})</h3>
          {data.lowStockProducts.length === 0 ? (
            <p style={{ color: 'var(--accent)' }}>All products have sufficient stock.</p>
          ) : (
            <ul style={{ listStyle: 'none' }}>
              {data.lowStockProducts.map(p => (
                <li key={p._id} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{p.name} (SKU: {p.sku})</span> <strong style={{ color: 'var(--danger)' }}>Qty: {p.quantity}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
