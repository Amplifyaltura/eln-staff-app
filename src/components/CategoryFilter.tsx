import { motion } from 'framer-motion';

interface Props {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
  total: number;
  filtered: number;
}

export default function CategoryFilter({ categories, active, onChange, total, filtered }: Props) {
  return (
    <div className="w-full" style={{ borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 shrink-0">
          {categories.map(cat => (
            <motion.button
              key={cat}
              onClick={() => onChange(cat)}
              whileTap={{ scale: 0.95 }}
              className="shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200"
              style={{
                background: active === cat ? 'var(--color-gold)' : 'rgba(255,255,255,0.06)',
                color: active === cat ? '#0a1628' : 'rgba(255,255,255,0.65)',
                border: active === cat ? '1px solid var(--color-gold)' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
        <div className="ml-auto shrink-0 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {filtered === total ? `${total} products` : `${filtered} of ${total}`}
        </div>
      </div>
    </div>
  );
}
