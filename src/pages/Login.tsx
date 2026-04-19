import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Invalid username or password');
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0b1729',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        background: '#112240',
        padding: '40px 30px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        <h2 style={{ 
          color: '#d4af37', 
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '28px',
          fontWeight: '700'
        }}>
          Admin Login
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username (e.g. admin@eln)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '15px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              background: '#1e2a4a',
              color: 'white'
            }}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              background: '#1e2a4a',
              color: 'white'
            }}
            required
          />

          {error && (
            <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '15px' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#d4af37',
              color: '#0b1729',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '15px'
            }}
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>

        <p style={{ 
          textAlign: 'center', 
          marginTop: '20px', 
          color: '#aaa', 
          fontSize: '14px' 
        }}>
          Only Administrators can access this page
        </p>
      </div>
    </div>
  );
}
