import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../types';

interface Props {
  product: Product | null;
  allProducts: Product[];
  onClose: () => void;
}

export default function ProductModal({ product, allProducts, onClose }: Props) {
  const [imgError, setImgError] = useState(false);
  const [current, setCurrent] = useState<Product | null>(product);

  useEffect(() => {
    setCurrent(product);
    setImgError(false);
  }, [product]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const navigate = (dir: number) => {
    if (!current) return;
    const idx = allProducts.findIndex(p => p.id === current.id);
    const next = allProducts[(idx + dir + allProducts.length) % allProducts.length];
    setCurrent(next);
    setImgError(false);
  };

  return (
    <AnimatePresence>
      {product && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(5,12,25,0.92)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
            style={{ background: 'var(--color-card)', border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80"
              style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Nav arrows */}
            {allProducts.length > 1 && (
              <>
                <button
                  onClick={() => navigate(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80"
                  style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => navigate(1)}
                  className="absolute right-12 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80"
                  style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative" style={{ paddingTop: '56%', background: 'rgba(0,0,0,0.4)' }}>
              {!imgError ? (
                <img
                  src={current.image}
                  alt={current.name}
                  className="absolute inset-0 w-full h-full object-contain p-4"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center" style={{ color: 'rgba(212,175,55,0.3)' }}>
                  <Package className="w-16 h-16" />
                </div>
              )}
              {current.category && (
                <div
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
                  style={{ background: 'rgba(10,22,40,0.9)', color: 'var(--color-gold)', border: '1px solid rgba(212,175,55,0.4)' }}
                >
                  {current.category}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-5">
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-gold)' }}>{current.name}</h2>
              {current.description && (
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>{current.description}</p>
              )}
              {current.tags && current.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4" style={{ color: 'rgba(212,175,55,0.5)' }} />
                  {current.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: 'rgba(212,175,55,0.1)', color: 'rgba(212,175,55,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(212,175,55,0.1)' }}>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>ID: {current.id}</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{allProducts.findIndex(p => p.id === current.id) + 1} / {allProducts.length}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
