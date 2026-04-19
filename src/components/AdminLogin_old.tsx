import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdminLogin() {
  const { signIn, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'var(--color-bg)' }}>
      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(212,175,55,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(212,175,55,0.04) 0%, transparent 50%)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)', border: '2px solid rgba(212,175,55,0.3)' }}>
            <ShieldCheck className="w-8 h-8" style={{ color: 'var(--color-gold)' }} />
          </div>
          <h1 className="text-2xl font-black" style={{ color: 'white' }}>
            Eln Balustrade
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(212,175,55,0.7)' }}>Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: 'var(--color-card)', border: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          <h2 className="text-lg font-bold mb-6" style={{ color: 'white' }}>Sign In</h2>

          {!isConfigured && (
            <div className="mb-5 p-3 rounded-lg flex items-start gap-2" style={{ background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.25)' }}>
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'rgba(255,200,80,0.8)' }} />
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,200,80,0.8)' }}>
                <strong>Supabase not connected.</strong> Set up your environment variables to enable cloud sync and admin login. See setup instructions below.
              </p>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg flex items-center gap-2"
              style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.25)' }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,100,100,0.9)' }} />
              <p className="text-xs" style={{ color: 'rgba(255,120,120,0.9)' }}>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(212,175,55,0.8)' }}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(212,175,55,0.4)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@elnbalustrade.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.2)', color: 'white' }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.6)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(212,175,55,0.8)' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(212,175,55,0.4)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.2)', color: 'white' }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.6)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(212,175,55,0.4)' }}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3 rounded-lg text-sm font-bold tracking-wide transition-all hover:opacity-90 disabled:opacity-40 mt-2"
              style={{ background: 'var(--color-gold)', color: '#0a1628' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(212,175,55,0.1)' }}>
            <p className="text-xs text-center mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Staff don't need to login</p>
            <Link
              to="/"
              className="block text-center py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}
            >
              ← Back to Product Gallery
            </Link>
          </div>
        </div>

        {/* Setup hint */}
        {!isConfigured && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 rounded-xl p-5 text-xs leading-relaxed"
            style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', color: 'rgba(255,255,255,0.45)' }}
          >
            <p className="font-bold mb-2" style={{ color: 'rgba(212,175,55,0.7)' }}>⚡ Quick Setup (5 minutes)</p>
            <ol className="space-y-1.5 list-decimal list-inside">
              <li>Go to <strong style={{ color: 'rgba(212,175,55,0.6)' }}>supabase.com</strong> → Create free account</li>
              <li>Create a new project</li>
              <li>Run the SQL setup (see instructions below)</li>
              <li>Copy your Project URL + Anon Key</li>
              <li>Add them as environment variables in Vercel</li>
            </ol>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
