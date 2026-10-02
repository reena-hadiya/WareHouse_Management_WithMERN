import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Trash2, Edit, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ManagePersonnel() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  
  // Search and Pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  // Edit states
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/admin/users?search=${searchTerm}&page=${currentPage}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users || res.data); // Support both old and new backend response
      if (res.data.totalPages) setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('User deleted successfully');
      fetchUsers();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({ name: user.name, email: user.email, role: user.role });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/users/${editingUser._id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('User updated successfully');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update user');
    }
  };

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Users /> Manage Warehouse Personnel
      </h2>
      {message && <div style={{ marginBottom: '1rem', color: 'var(--accent)' }}>{message}</div>}

      {/* Search Bar */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
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
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No users found</td></tr>
            ) : (
              users.map(u => (
                <tr key={u._id}>
                  <td>{u._id.substring(0, 8)}...</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', background: u.role === 'Supervisor' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)' }}>{u.role}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEditClick(u)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(u._id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }}>
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

      {/* Edit Modal */}
      {editingUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass" style={{ padding: '2rem', width: '100%', maxWidth: '400px', position: 'relative' }}>
            <button onClick={() => setEditingUser(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: '1.5rem' }}>Edit User</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" required value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" required value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-control" value={editFormData.role} onChange={e => setEditFormData({...editFormData, role: e.target.value})}>
                  <option value="Staff">Staff</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
