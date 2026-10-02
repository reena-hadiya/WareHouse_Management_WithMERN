import { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, Edit, Trash2, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ManageStorage() {
  const [formData, setFormData] = useState({ zone: '', shelf: '', bin: '', capacity: 100 });
  const [message, setMessage] = useState('');
  
  // Table state
  const [locations, setLocations] = useState([]);
  
  // Search and Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  // Edit stock
  const [editingLoc, setEditingLoc] = useState(null);
  const [editFormData, setEditFormData] = useState({ zone: '', shelf: '', bin: '', capacity: 0 });

  useEffect(() => {
    fetchLocations();
  }, [currentPage, searchTerm]);

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/supervisor/storage-location?search=${searchTerm}&page=${currentPage}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLocations(res.data.locations || res.data);
      if (res.data.totalPages) setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/supervisor/storage-location', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Storage location created successfully!');
      setFormData({ zone: '', shelf: '', bin: '', capacity: 100 });
      fetchLocations();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create location');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this storage location?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/supervisor/storage-location/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Location deleted');
      fetchLocations();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete record');
    }
  };

  const handleEditClick = (loc) => {
    setEditingLoc(loc);
    setEditFormData({ zone: loc.zone, shelf: loc.shelf, bin: loc.bin, capacity: loc.capacity });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/supervisor/storage-location/${editingLoc._id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Location updated');
      setEditingLoc(null);
      fetchLocations();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update record');
    }
  };

  return (
    <div>
        <div className="glass" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto 2rem auto' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings /> Create Storage Location
          </h2>
          {message && <div style={{ marginBottom: '1rem', color: 'var(--accent)' }}>{message}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Zone</label>
                <input type="text" className="form-control" required value={formData.zone} onChange={e => setFormData({ ...formData, zone: e.target.value })} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Shelf</label>
                <input type="text" className="form-control" required value={formData.shelf} onChange={e => setFormData({ ...formData, shelf: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Bin</label>
                <input type="text" className="form-control" required value={formData.bin} onChange={e => setFormData({ ...formData, bin: e.target.value })} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Total Capacity</label>
                <input type="number" className="form-control" required value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Location</button>
          </form>
        </div>

        <div className="glass" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Manage Existing Locations</h2>
          
          {/* Search Bar */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search by zone, shelf, or bin..." 
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
                  <th>Location Path</th>
                  <th>Current Product</th>
                  <th>Occupancy</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>No locations found.</td></tr>
                ) : (
                  locations.map(s => (
                    <tr key={s._id}>
                      <td>{s.zone} / {s.shelf} / {s.bin}</td>
                      <td>{s.productId?.name || 'Empty'} (SKU: {s.productId?.sku || 'N/A'})</td>
                      <td>{s.currentOccupancy}</td>
                      <td>{s.capacity}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleEditClick(s)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(s._id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }} disabled={s.currentOccupancy > 0}>
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

        {/* Edit Modal */}
        {editingLoc && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass" style={{ padding: '2rem', width: '100%', maxWidth: '400px', position: 'relative' }}>
              <button onClick={() => setEditingLoc(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
              <h3 style={{ marginBottom: '1.5rem' }}>Edit Location</h3>
              <form onSubmit={handleEditSubmit}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Zone</label>
                        <input type="text" className="form-control" required value={editFormData.zone} onChange={e => setEditFormData({...editFormData, zone: e.target.value})} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Shelf</label>
                        <input type="text" className="form-control" required value={editFormData.shelf} onChange={e => setEditFormData({...editFormData, shelf: e.target.value})} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Bin</label>
                        <input type="text" className="form-control" required value={editFormData.bin} onChange={e => setEditFormData({...editFormData, bin: e.target.value})} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Capacity</label>
                        <input type="number" className="form-control" required value={editFormData.capacity} onChange={e => setEditFormData({...editFormData, capacity: e.target.value})} min="1" />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Changes</button>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}
