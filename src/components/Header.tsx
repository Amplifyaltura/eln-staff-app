import { Search, ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
}

export default function Header({ query, onQueryChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full" style={{ background: 'var(--color-navy)', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center" style={{ background: 'var(--color-gold)', boxShadow: '0 0 12px rgba(212,175,55,0.4)' }}>
            <img
              src="/images/logo.png"
              alt="Company Logo"
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
            <div className="text-white font-bold text-sm leading-tight tracking-wide">Product Gallery</div>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-gold)' }} />
          <input
            type="text"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder="Search products, categories, tags…"
            className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm font-medium outline-none transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(212,175,55,0.25)',
              color: 'white',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'var(--color-gold)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.15)';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
              style={{ background: 'rgba(212,175,55,0.3)' }}
            >
              <X className="w-3 h-3 text-white" />
            </button>
          )}
        </div>

        {/* Admin Link */}
        <Link
          to="/admin"
          className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 hover:opacity-90"
          style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--color-gold)' }}
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="hidden sm:inline">Admin</span>
        </Link>
      </div>
    </header>
  );
}
