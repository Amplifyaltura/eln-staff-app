import { useState } from 'react';
import { Link } from 'react-router-dom';

const staffList = [
  "Emmanuel",
  "Aisha",
  "Fatima",
  "Chinedu",
  "Abdul",
  "Ola",
  "Admin"
];

export default function Attendance() {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckIn = () => {
    if (!selectedStaff) {
      setMessage("Please select your name");
      return;
    }
    if (!password) {
      setMessage("Please enter your password");
      return;
    }

    setLoading(true);

    // Simple demo check-in (you can connect to Supabase later)
    setTimeout(() => {
      setMessage(`✅ Attendance recorded for ${selectedStaff}`);
      setPassword('');
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0b1729',
      color: '#e0e0e0',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: '#112240',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        <h1 style={{ color: '#d4af37', textAlign: 'center', marginBottom: '10px' }}>
          Daily Attendance
        </h1>
        <p style={{ textAlign: 'center', color: '#aaa', marginBottom: '40px' }}>
          Select your name and enter password
        </p>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: '#d4af37' }}>
            Select Your Name:
          </label>
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              background: '#1e2a4a',
              color: 'white',
              border: 'none',
              fontSize: '16px'
            }}
          >
            <option value="">-- Select Name --</option>
            {staffList.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: '#d4af37' }}>
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              background: '#1e2a4a',
              color: 'white',
              border: 'none',
              fontSize: '16px'
            }}
          />
        </div>

        <button
          onClick={handleCheckIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            background: '#d4af37',
            color: '#0b1729',
            border: 'none',
            borderRadius: '8px',
            fontSize: '17px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '20px'
          }}
        >
          {loading ? 'Recording...' : 'Check In'}
        </button>

        {message && (
          <p style={{
            textAlign: 'center',
            padding: '15px',
            background: message.includes('✅') ? '#1a3c2e' : '#4a2c2c',
            color: message.includes('✅') ? '#4ade80' : '#ff6b6b',
            borderRadius: '8px',
            marginTop: '10px'
          }}>
            {message}
          </p>
        )}

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link to="/" style={{
            color: '#d4af37',
            textDecoration: 'none',
            fontSize: '15px'
          }}>
            ← Back to Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}
