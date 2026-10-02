import { useState, useEffect } from 'react';
import axios from 'axios';
import { PackagePlus, Edit, Trash2, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function IncomingStock() {
  const [formData, setFormData] = useState({ name: '', sku: '', category: '', quantity: '', price: '', description: '' });
  const [message, setMessage] = useState('');
  const [recentStock, setRecentStock] = useState([]);

  // Search and Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  // Edit stock
  const [editingStock, setEditingStock] = useState(null);

  useEffect(() => {
    fetchStock();
  }, [currentPage, searchTerm]);

  const fetchStock = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/staff/incoming-stock?search=${searchTerm}&page=${currentPage}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentStock(res.data.shipments || res.data);
      if (res.data.totalPages) setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingStock) {
        await axios.put(`http://localhost:5000/api/staff/incoming-stock/${editingStock}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Stock record updated successfully!');
        setEditingStock(null);
      } else {
        await axios.post('http://localhost:5000/api/staff/stock', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Stock recorded successfully!');
      }
      setFormData({ name: '', sku: '', category: '', quantity: '', price: '', description: '' });
      fetchStock(); 
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to record stock');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this incoming stock record? This will reduce the product quantity.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/staff/incoming-stock/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Stock record deleted');
      fetchStock();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete record');
    }
  };

  const handleEditClick = (stock) => {
    setEditingStock(stock._id);
    setFormData({
      name: stock.productId?.name || '',
      sku: stock.productId?.sku || '',
      category: stock.productId?.category || '',
      quantity: stock.quantity || '',
      price: stock.productId?.price || '',
      description: stock.productId?.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="glass" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto 2rem auto' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PackagePlus /> {editingStock ? 'Edit Stock Record' : 'Record Incoming Stock'}
        </h2>
        {message && <div style={{ marginBottom: '1rem', color: 'var(--accent)' }}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">SKU</label>
            <input type="text" className="form-control" required value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input type="text" className="form-control" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Quantity</label>
              <input type="number" className="form-control" required min="1" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Price</label>
              <input type="number" className="form-control" required min="0" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingStock ? 'Update Stock' : 'Save Stock'}</button>
            {editingStock && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ flex: 1 }} 
                onClick={() => {
                  setEditingStock(null);
                  setFormData({ name: '', sku: '', category: '', quantity: '', price: '', description: '' });
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Incoming Shipments Ledger</h2>
        
        {/* Search Bar */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by product name or SKU..." 
              className="form-control" 
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentStock.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No stock recorded.</td></tr>
              ) : (
                recentStock.map(s => (
                  <tr key={s._id}>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td>{s.productId?.name || 'Unknown'} (SKU: {s.productId?.sku || 'N/A'})</td>
                    <td>{s.quantity}</td>
                    <td><strong style={{ color: 'var(--accent)' }}>{s.status}</strong></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEditClick(s)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(s._id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              className="btn btn-secondary" 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              style={{ padding: '0.5rem 1rem' }}
            >
              <ChevronLeft size={18} /> Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
              className="btn btn-secondary" 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              style={{ padding: '0.5rem 1rem' }}
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
