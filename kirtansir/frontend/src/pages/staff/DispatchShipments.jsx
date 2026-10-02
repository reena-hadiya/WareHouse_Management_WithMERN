import { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck } from 'lucide-react';

export default function DispatchShipments() {
  const [products, setProducts] = useState([]);
  const [outgoings, setOutgoings] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [prodRes, outRes] = await Promise.all([
        axios.get('http://localhost:5000/api/staff/products', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/staff/outgoing-stock', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setProducts(prodRes.data);
      setOutgoings(outRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/staff/dispatch', { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Dispatch request submitted! Pending Supervisor approval.');
      setProductId('');
      setQuantity('');
      fetchData(); // Refresh table
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit dispatch');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/staff/shipments/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(`Shipment marked as ${newStatus}`);
      fetchData(); // Refresh table
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div>
      <div className="glass" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto 2rem auto' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Truck /> Prepare Order for Dispatch
        </h2>
        {message && <div style={{ marginBottom: '1rem', color: 'var(--accent)' }}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Product</label>
            <select className="form-control" required value={productId} onChange={e => setProductId(e.target.value)}>
              <option value="" disabled>-- Select a Product --</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name} (SKU: {p.sku}) - {p.quantity} in stock
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Dispatch Quantity</label>
            <input type="number" className="form-control" required min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={!productId || quantity <= 0}>
            Submit for Approval
          </button>
        </form>
      </div>

      <div className="glass" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Recent Dispatch Requests</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {outgoings.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center' }}>No dispatch requests found.</td></tr>
              ) : (
                outgoings.map(s => (
                  <tr key={s._id}>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td>{s.productId?.name || 'Unknown'}</td>
                    <td>{s.quantity}</td>
                    <td>
                      <strong style={{
                        color: s.status === 'Pending' ? 'var(--warning)' :
                          s.status === 'Approved' ? 'var(--primary)' :
                            s.status === 'Dispatched' ? 'var(--accent)' : 'inherit'
                      }}>
                        {s.status}
                      </strong>
                    </td>
                    <td>
                      {s.status === 'Approved' && (
                        <button onClick={() => handleUpdateStatus(s._id, 'Dispatched')} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', marginTop: 0, fontSize: '0.8rem' }}>
                          Mark Dispatched
                        </button>
                      )}
                      {s.status === 'Dispatched' && (
                        <button onClick={() => handleUpdateStatus(s._id, 'Delivered')} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', marginTop: 0, fontSize: '0.8rem', background: 'var(--accent)' }}>
                          Mark Delivered
                        </button>
                      )}
                    </td>
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
