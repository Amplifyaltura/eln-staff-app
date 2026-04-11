import { motion } from 'framer-motion';
import { Search, Package } from 'lucide-react';

interface Props {
  query: string;
  onClear: () => void;
}

export default function EmptyState({ query, onClear }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 px-8 text-center"
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'rgba(212,175,55,0.08)', border: '2px solid rgba(212,175,55,0.2)' }}
      >
        {query ? <Search className="w-8 h-8" style={{ color: 'rgba(212,175,55,0.5)' }} /> : <Package className="w-8 h-8" style={{ color: 'rgba(212,175,55,0.5)' }} />}
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-gold)' }}>
        {query ? 'No products found' : 'No products yet'}
      </h3>
      <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {query ? `No results for "${query}". Try a different search term.` : 'Add products through the admin dashboard to get started.'}
      </p>
      {query && (
        <button
          onClick={onClear}
          className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: 'var(--color-gold)', color: '#0a1628' }}
        >
          Clear Search
        </button>
      )}
    </motion.div>
  );
}
