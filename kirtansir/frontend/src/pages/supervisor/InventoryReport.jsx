import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText } from 'lucide-react';

export default function InventoryReport() {
  const [data, setData] = useState({ products: [], locations: [] });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/supervisor/inventory-report', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReport();
  }, []);

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FileText /> Full Inventory Report
      </h2>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Products in System</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Total Qty</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map(p => (
              <tr key={p._id}>
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
