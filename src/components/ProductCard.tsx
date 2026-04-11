import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import type { Product } from '../types';

interface Props {
  product: Product;
  index: number;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, index, onClick }: Props) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onClick(product)}
      className="cursor-pointer rounded-2xl overflow-hidden flex flex-col group"
      style={{
        background: 'var(--color-card)',
        border: '1px solid rgba(212,175,55,0.12)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ paddingTop: '75%', background: 'rgba(255,255,255,0.04)' }}
      >
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ color: 'rgba(212,175,55,0.4)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>No image</span>
          </div>
        )}
        {/* Category badge */}
        {product.category && (
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide"
            style={{ background: 'rgba(10,22,40,0.85)', color: 'var(--color-gold)', border: '1px solid rgba(212,175,55,0.3)', backdropFilter: 'blur(4px)' }}
          >
            {product.category}
          </div>
        )}
        {/* Overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          style={{ background: 'rgba(10,22,40,0.6)' }}
        >
          <div
            className="px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: 'var(--color-gold)', color: '#0a1628' }}
          >
            View Details
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <h3 className="text-sm font-bold leading-tight" style={{ color: 'var(--color-gold)' }}>
          {product.name}
        </h3>
        {product.tags && product.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            <Tag className="w-3 h-3 shrink-0" style={{ color: 'rgba(212,175,55,0.4)' }} />
            {product.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(255,255,255,0.5)' }}
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>+{product.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
