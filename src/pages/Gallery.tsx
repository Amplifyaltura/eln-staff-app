import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const staffNames = ["Emmanuel", "Aisha", "Fatima", "Chinedu", "Admin"];

export default function Gallery() {
  const { user, logout, isAdmin } = useAuth();
  const [search, setSearch] = useState('');

  return (
    <div style={{ background: '#0b1729', minHeight: '100vh', color: '#e0e0e0' }}>
      {/* Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1 style={{ color: '#d4af37', margin: 0 }}>ELN Balustrade</h1>
          <p style={{ margin: 0, color: '#aaa' }}>Product Gallery</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {user ? (
            <>
              <span style={{ color: '#d4af37' }}>Welcome, {user.email}</span>
              <button onClick={logout} style={{
                padding: '8px 16px',
                background: '#d4af37',
                color: '#0b1729',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{
              padding: '10px 24px',
              background: '#d4af37',
              color: '#0b1729',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: '600'
            }}>
              Admin Login
            </Link>
          )}
        </div>
      </header>

      <div style={{ padding: '40px' }}>
        <h2 style={{ color: '#d4af37', textAlign: 'center', marginBottom: '30px' }}>
          Our Team
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '20px',
          marginBottom: '60px'
        }}>
          {staffNames.map(name => (
            <div key={name} style={{
              background: '#112240',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              color: '#d4af37',
              fontSize: '18px',
              fontWeight: '500'
            }}>
              {name}
            </div>
          ))}
        </div>

        <h2 style={{ color: '#d4af37', textAlign: 'center', marginBottom: '30px' }}>
          Product Gallery
        </h2>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
            display: 'block',
            padding: '16px',
            borderRadius: '50px',
            border: 'none',
            background: '#1e2a4a',
            color: 'white',
            fontSize: '16px'
          }}
        />

        {isAdmin && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/admin" style={{
              background: '#d4af37',
              color: '#0b1729',
              padding: '14px 32px',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              Manage Products (Admin)
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
