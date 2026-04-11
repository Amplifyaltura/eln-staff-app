import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff, Search, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import CategoryFilter from '../components/CategoryFilter';
import EmptyState from '../components/EmptyState';
import LoadingGrid from '../components/LoadingGrid';
import AppShell from '../components/AppShell';
import { useProducts } from '../hooks/useProducts';
import { useSearch } from '../hooks/useSearch';
import type { Product } from '../types';

export default function Gallery() {
  const { products, loading, error, reload } = useProducts();
  const { query, setQuery, activeCategory, setActiveCategory, categories, filtered } = useSearch(products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOnline] = useState(() => navigator.onLine);

  return (
    <AppShell>
      {/* Search bar */}
      <div className="sticky top-[61px] z-30 w-full" style={{ background: 'var(--color-bg)', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-gold)' }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products, categories, tags…"
              className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm font-medium outline-none transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.25)', color: 'white' }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-gold)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.15)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.3)' }}>
                <X className="w-3 h-3 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      <CategoryFilter
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
        total={products.length}
        filtered={filtered.length}
      />

      {/* Offline Banner */}
      {!isOnline && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm" style={{ background: 'rgba(255,165,0,0.1)', border: '1px solid rgba(255,165,0,0.3)', color: 'rgba(255,200,100,0.9)' }}>
            <WifiOff className="w-4 h-4" />
            You're offline. Showing cached products.
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: 'white' }}>
              Eln Balustrade <span style={{ color: 'var(--color-gold)' }}>Product Gallery</span>
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Aluminum Balustrade Pipes & Accessories</p>
          </div>
          <div className="flex items-center gap-2">
            {isOnline
              ? <Wifi className="w-4 h-4" style={{ color: 'rgba(100,255,150,0.6)' }} />
              : <WifiOff className="w-4 h-4" style={{ color: 'rgba(255,165,0,0.6)' }} />
            }
            <button onClick={reload} className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }} title="Refresh">
              <RefreshCw className="w-4 h-4" style={{ color: 'var(--color-gold)' }} />
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingGrid />
        ) : error ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-sm" style={{ color: 'rgba(255,100,100,0.8)' }}>{error}</p>
            <button onClick={reload} className="px-6 py-2.5 rounded-full text-sm font-semibold" style={{ background: 'var(--color-gold)', color: '#0a1628' }}>Retry</button>
          </motion.div>
        ) : filtered.length === 0 ? (
          <EmptyState query={query} onClear={() => { setQuery(''); setActiveCategory('All'); }} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} onClick={setSelectedProduct} />
            ))}
          </div>
        )}
      </div>

      <ProductModal product={selectedProduct} allProducts={filtered} onClose={() => setSelectedProduct(null)} />

      <footer className="mt-8 py-6" style={{ borderTop: '1px solid rgba(212,175,55,0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>© {new Date().getFullYear()} Eln Balustrade — Internal Staff Training Tool</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>{products.length} products in catalogue</p>
        </div>
      </footer>
    </AppShell>
  );
}
