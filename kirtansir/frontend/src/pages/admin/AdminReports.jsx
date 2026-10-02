import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download } from 'lucide-react';

export default function AdminReports() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/reports', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReport(res.data);
      } catch (err) {
        console.error('Failed to fetch reports', err);
      }
    };
    fetchReports();
  }, []);

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "operational_report.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!report) return <div style={{ padding: '2rem' }}>Loading report...</div>;

  return (
    <div className="glass" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText /> Operational Report
        </h2>
        <button onClick={handleDownload} className="btn btn-primary" style={{ marginTop: 0, padding: '0.5rem 1rem' }}>
          <Download size={18} /> Export JSON
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>Shipments Breakdown</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Shipments:</span> <strong>{report.shipments.total}</strong></li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Incoming:</span> <strong>{report.shipments.incoming}</strong></li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Outgoing:</span> <strong>{report.shipments.outgoing}</strong></li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Pending Approval:</span> <strong style={{ color: 'var(--warning)' }}>{report.shipments.pending}</strong></li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Delivered / Completed:</span> <strong style={{ color: 'var(--accent)' }}>{report.shipments.delivered}</strong></li>
          </ul>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>Inventory Breakdown</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Unique Product SKUs:</span> <strong>{report.inventory.totalProducts}</strong></li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Completely Out of Stock:</span> <strong style={{ color: report.inventory.outOfStock > 0 ? 'var(--danger)' : 'var(--accent)' }}>{report.inventory.outOfStock}</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
