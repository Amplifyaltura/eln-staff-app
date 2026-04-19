import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

type AttendanceRecord = {
  id: number;
  staffName: string;
  date: string;
  time: string;
  status: string;
};

const sampleRecords: AttendanceRecord[] = [
  { id: 1, staffName: "Emmanuel", date: "2025-04-05", time: "08:15 AM", status: "Present" },
  { id: 2, staffName: "Aisha", date: "2025-04-05", time: "08:05 AM", status: "Present" },
  { id: 3, staffName: "Fatima", date: "2025-04-05", time: "09:10 AM", status: "Late" },
  { id: 4, staffName: "Chinedu", date: "2025-04-05", time: "08:00 AM", status: "Present" },
  { id: 5, staffName: "Abdul", date: "2025-04-04", time: "08:20 AM", status: "Present" },
];

export default function AttendanceAdmin() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [records] = useState<AttendanceRecord[]>(sampleRecords);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Redirecting to login...</div>;
  }

  return (
    <div style={{ background: '#0b1729', minHeight: '100vh', color: '#e0e0e0' }}>
      <header style={{
        background: 'rgba(11, 23, 41, 0.95)',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <h2 style={{ color: '#d4af37', margin: 0 }}>Attendance Records</h2>
        <div>
          <span style={{ marginRight: '20px', color: '#aaa' }}>
            Admin: {user?.email}
          </span>
          <button 
            onClick={logout}
            style={{
              padding: '8px 20px',
              background: '#d4af37',
              color: '#0b1729',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={{ padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ color: '#d4af37' }}>Staff Attendance Overview</h3>
          <Link to="/admin" style={{
            color: '#d4af37',
            textDecoration: 'none',
            padding: '10px 20px',
            border: '1px solid #d4af37',
            borderRadius: '8px'
          }}>
            Back to Admin Dashboard
          </Link>
        </div>

        <div style={{ background: '#112240', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1e2a4a' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Staff Name</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Time</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record.id} style={{ borderTop: '1px solid #334155' }}>
                  <td style={{ padding: '15px' }}>{record.staffName}</td>
                  <td style={{ padding: '15px' }}>{record.date}</td>
                  <td style={{ padding: '15px' }}>{record.time}</td>
                  <td style={{ 
                    padding: '15px',
                    color: record.status === 'Present' ? '#4ade80' : '#fbbf24'
                  }}>
                    {record.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ textAlign: 'center', marginTop: '30px', color: '#777', fontSize: '14px' }}>
          This is a sample. We can connect this to your Supabase database later to show real records.
        </p>
      </div>
    </div>
  );
}
