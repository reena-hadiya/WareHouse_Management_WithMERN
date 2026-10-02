import { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck } from 'lucide-react';

export default function ApproveDispatch() {
  const [shipments, setShipments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOperations();
  }, []);

  const fetchOperations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/supervisor/operations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShipments(res.data.outgoing.filter(s => s.status === 'Pending'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/supervisor/approve-dispatch/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Dispatch approved successfully');
      fetchOperations();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to approve');
    }
  };

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Truck /> Pending Dispatch Approvals
      </h2>
      {message && <div style={{ marginBottom: '1rem', color: 'var(--accent)' }}>{message}</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Requested By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {shipments.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No pending approvals</td></tr>
            ) : (
              shipments.map(s => (
                <tr key={s._id}>
                  <td>{s._id}</td>
                  <td>{s.productId?.name || 'Unknown'} (SKU: {s.productId?.sku || 'N/A'})</td>
                  <td>{s.quantity}</td>
                  <td>{s.handledBy?.name || 'Unknown'}</td>
                  <td>
                    <button onClick={() => handleApprove(s._id)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      Approve
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
