import { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, Trash2 } from 'lucide-react';

export default function AdminRecords() {
  const [records, setRecords] = useState({ products: [], shipments: [] });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/records', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(res.data);
    } catch (err) {
      console.error('Failed to fetch records', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('WARNING: Deleting a product may orphan shipment records. Continue?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Product deleted from database forever.');
      fetchRecords();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Settings /> Maintain Product and Shipment Records
      </h2>
      {message && <div style={{ marginBottom: '1rem', color: 'var(--danger)' }}>{message}</div>}

      <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Product Database Records</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>DB _id</th>
                <th>SKU</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.products.length === 0 ? (
                <tr><td colSpan="4">No products found.</td></tr>
              ) : (
                records.products.map(p => (
                  <tr key={p._id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p._id}</td>
                    <td>{p.sku}</td>
                    <td>{p.name}</td>
                    <td>
                      <button onClick={() => handleDeleteProduct(p._id)} className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', marginTop: 0 }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Shipment Audit Logs</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Shipment DB _id</th>
                <th>Type</th>
                <th>Product</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.shipments.length === 0 ? (
                <tr><td colSpan="4">No shipments found.</td></tr>
              ) : (
                records.shipments.slice(0, 10).map(s => (
                  <tr key={s._id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s._id}</td>
                    <td>{s.type}</td>
                    <td>{s.productId?.name || 'Deleted Product'}</td>
                    <td>{s.status}</td>
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
