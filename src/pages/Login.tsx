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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(username, password);

    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid username or password');
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
      padding: '20px'
    }}>
      <div style={{
        background: '#112240',
        padding: '50px 40px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{ 
          color: '#d4af37', 
          textAlign: 'center',
          marginBottom: '35px',
          fontSize: '32px',
          fontWeight: '700'
        }}>
          Admin Login
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username (e.g. admin@eln)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              marginBottom: '15px',
              borderRadius: '8px',
              border: 'none',
              background: '#1e2a4a',
              color: 'white',
              fontSize: '16px'
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
              padding: '16px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: 'none',
              background: '#1e2a4a',
              color: 'white',
              fontSize: '16px'
            }}
            required
          />

          {error && <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: '#d4af37',
              color: '#0b1729',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              fontSize: '17px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', color: '#777', fontSize: '14px' }}>
          Only administrators can access this area
        </p>
      </div>
    </div>
  );
}
