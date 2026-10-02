import { useState, useEffect } from 'react';
import axios from 'axios';
import { Archive } from 'lucide-react';

export default function StorageLocations() {
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [productId, setProductId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [prodRes, locRes] = await Promise.all([
        axios.get('http://localhost:5000/api/staff/products', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/staff/locations', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setProducts(prodRes.data);
      setLocations(locRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/staff/storage/${productId}`, { locationId, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Storage assigned successfully!');
      setProductId('');
      setLocationId('');
      setQuantity('');
      fetchData(); // Refresh table
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to assign storage');
    }
  };

  return (
    <div>
      <div className="glass" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto 2rem auto' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Archive /> Assign Storage Location
        </h2>
        {message && <div style={{ marginBottom: '1rem', color: 'var(--accent)' }}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Product</label>
            <select className="form-control" required value={productId} onChange={e => setProductId(e.target.value)}>
              <option value="" disabled>-- Select a Product --</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>{p.name} (SKU: {p.sku})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Select Location</label>
            <select className="form-control" required value={locationId} onChange={e => setLocationId(e.target.value)}>
              <option value="" disabled>-- Select a Location --</option>
              {locations.map(loc => (
                <option key={loc._id} value={loc._id}>
                  Zone {loc.zone} - Shelf {loc.shelf} - Bin {loc.bin}
                  (Avail: {loc.capacity - loc.currentOccupancy} / {loc.capacity})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Quantity to Store</label>
            <input type="number" className="form-control" required min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={!productId || !locationId || quantity <= 0}>
            Assign Storage
          </button>
        </form>
      </div>

      <div className="glass" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Current Storage Assignments</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Stored Product</th>
                <th>Occupancy</th>
                <th>Capacity</th>
              </tr>
            </thead>
            <tbody>
              {locations.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center' }}>No locations setup yet.</td></tr>
              ) : (
                locations.map(loc => (
                  <tr key={loc._id}>
                    <td>Zone {loc.zone} &gt; Shelf {loc.shelf} &gt; Bin {loc.bin}</td>
                    <td>{loc.productId ? `${loc.productId.name} (${loc.productId.sku})` : <span style={{ color: 'var(--text-muted)' }}>Empty</span>}</td>
                    <td><strong style={{ color: loc.currentOccupancy > 0 ? 'var(--accent)' : 'inherit' }}>{loc.currentOccupancy}</strong></td>
                    <td>{loc.capacity}</td>
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
