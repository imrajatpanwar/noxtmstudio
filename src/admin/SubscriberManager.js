import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'noxtm_newsletter_subscribers';

function SubscriberManager() {
  const [subscribers, setSubscribers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    setSubscribers(saved);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (id) => {
    const updated = subscribers.filter(s => s.id !== id);
    setSubscribers(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast('Subscriber removed.');
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      showToast('No subscribers to export.', 'error');
      return;
    }
    const header = 'Email,Subscribed Date';
    const rows = subscribers.map(s =>
      `"${s.email}","${new Date(s.subscribedAt).toLocaleString()}"`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'noxtm_subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV downloaded!');
  };

  const handleCopyEmails = () => {
    if (subscribers.length === 0) {
      showToast('No subscribers to copy.', 'error');
      return;
    }
    const emails = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emails).then(() => {
      showToast('All emails copied to clipboard!');
    }).catch(() => {
      showToast('Failed to copy emails.', 'error');
    });
  };

  const filtered = subscribers.filter(s =>
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ position: 'relative' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          padding: '12px 24px', borderRadius: 8,
          background: toast.type === 'error' ? '#FEE2E2' : '#DCFCE7',
          color: toast.type === 'error' ? '#DC2626' : '#16A34A',
          fontWeight: 600, fontSize: 14,
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          fontFamily: 'Switzer, sans-serif',
        }}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, fontFamily: 'Switzer, sans-serif' }}>
            📧 Newsletter Subscribers
          </h1>
          <p style={{ margin: '4px 0 0', color: '#7A7A7A', fontSize: 14 }}>
            {subscribers.length} total subscriber{subscribers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleCopyEmails} style={{
            padding: '8px 16px', borderRadius: 8,
            border: '1px solid #E5E7EB', background: '#fff',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            fontFamily: 'Switzer, sans-serif',
          }}>
            📋 Copy Emails
          </button>
          <button onClick={handleExportCSV} style={{
            padding: '8px 16px', borderRadius: 8,
            border: 'none', background: '#131313', color: '#fff',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Switzer, sans-serif',
          }}>
            ⬇ Export CSV
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            width: '100%', maxWidth: 360, padding: '10px 14px',
            border: '1px solid #E5E7EB', borderRadius: 8,
            fontSize: 14, fontFamily: 'Switzer, sans-serif',
            outline: 'none', background: '#fff',
          }}
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 60, color: '#7A7A7A',
          fontSize: 14, fontFamily: 'Switzer, sans-serif',
        }}>
          {searchTerm ? 'No subscribers matching your search.' : 'No subscribers yet. They will appear here when visitors subscribe via the blog newsletter.'}
        </div>
      ) : (
        <div style={{
          background: '#fff', borderRadius: 12,
          border: '1px solid #E5E7EB', overflow: 'hidden',
        }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse',
            fontFamily: 'Switzer, sans-serif', fontSize: 14,
          }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280' }}>#</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280' }}>Subscribed Date</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub, idx) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 16px', color: '#9CA3AF' }}>{idx + 1}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{sub.email}</td>
                  <td style={{ padding: '12px 16px', color: '#6B7280' }}>
                    {new Date(sub.subscribedAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      style={{
                        padding: '6px 12px', borderRadius: 6,
                        border: '1px solid #FCA5A5', background: '#FEF2F2',
                        color: '#DC2626', fontSize: 12, fontWeight: 500,
                        cursor: 'pointer', fontFamily: 'Switzer, sans-serif',
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SubscriberManager;
