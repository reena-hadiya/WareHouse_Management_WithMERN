import { useState, useEffect } from 'react';
import axios from 'axios';
import { PackagePlus, ArrowRightLeft, Warehouse, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/staff/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Warehouse Staff Overview</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Link to="/staff/stock" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="glass stat-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div className="stat-icon"><PackagePlus size={24} /></div>
            <div className="stat-info">
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>Record</h3>
              <p>New Incoming Stock</p>
            </div>
          </div>
        </Link>

        <Link to="/staff/storage" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="glass stat-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div className="stat-icon"><Warehouse size={24} /></div>
            <div className="stat-info">
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>Assign</h3>
              <p>Storage Locations</p>
            </div>
          </div>
        </Link>

        <Link to="/staff/shipments" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="glass stat-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div className="stat-icon"><ArrowRightLeft size={24} /></div>
            <div className="stat-info">
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>Dispatch</h3>
              <p>Prepare Orders</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="glass" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Inventory Overview</h2>
        <p style={{ color: 'var(--text-muted)' }}>Current products available in the system.</p>
        <div className="table-container" style={{ marginTop: '1rem' }}>
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Current Qty</th>
                <th>Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No products found. Start by recording incoming stock above.
                  </td>
                </tr>
              ) : (
                products.map(p => (
                  <tr key={p._id}>
                    <td>{p.sku}</td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td><strong style={{ color: p.quantity > 0 ? 'var(--accent)' : 'var(--danger)' }}>{p.quantity}</strong></td>
                    <td>${p.price}</td>
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
