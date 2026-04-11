import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Clock, ShieldCheck } from 'lucide-react';
import { useAttendance } from '../hooks/useAttendance';

interface Props {
  children: ReactNode;
  query?: string;
  onQueryChange?: (q: string) => void;
  showSearch?: boolean;
}

export default function AppShell({ children }: Props) {
  const location = useLocation();
  const { session } = useAttendance();

  const tabs = [
    { path: '/', label: 'Products', icon: LayoutGrid },
    { path: '/attendance', label: 'Attendance', icon: Clock },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full" style={{ background: 'var(--color-navy)', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center" style={{ background: 'var(--color-gold)', boxShadow: '0 0 12px rgba(212,175,55,0.4)' }}>
              <img
                src="/images/logo.png"
                alt="Logo"
                className="w-full h-full object-cover"
                onError={e => {
                  const t = e.currentTarget;
                  t.style.display = 'none';
                  t.parentElement!.innerHTML = '<span style="font-weight:900;font-size:0.85rem;color:#0a1628;font-family:serif;">ELN</span>';
                }}
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--color-gold)', letterSpacing: '0.2em' }}>Eln Balustrade</div>
              <div className="text-white font-bold text-sm leading-tight">Product Gallery</div>
            </div>
          </Link>

          <div className="flex-1" />

          {/* Attendance status pill */}
          {session && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: session.status === 'on-errand' ? 'rgba(255,200,80,0.1)' : 'rgba(100,255,150,0.1)', border: `1px solid ${session.status === 'on-errand' ? 'rgba(255,200,80,0.3)' : 'rgba(100,255,150,0.3)'}`, color: session.status === 'on-errand' ? 'rgba(255,200,80,0.9)' : 'rgba(100,255,150,0.9)' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'currentColor' }} />
              {session.staffName.split(' ')[0]} — {session.status === 'on-errand' ? 'On Errand' : 'Clocked In'}
            </div>
          )}

          <Link
            to="/admin"
            className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold"
            style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--color-gold)' }}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-24">
        {children}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40" style={{ background: 'var(--color-navy)', borderTop: '1px solid rgba(212,175,55,0.2)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {tabs.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className="flex flex-col items-center gap-1 py-3 px-8 transition-all"
                style={{ color: active ? 'var(--color-gold)' : 'rgba(255,255,255,0.35)' }}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {path === '/attendance' && session && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full" style={{ background: session.status === 'on-errand' ? 'rgba(255,200,80,0.9)' : 'rgba(100,255,150,0.9)' }} />
                  )}
                </div>
                <span className="text-xs font-semibold">{label}</span>
                {active && <div className="w-4 h-0.5 rounded-full" style={{ background: 'var(--color-gold)' }} />}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
