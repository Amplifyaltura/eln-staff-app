import { useState, useMemo } from 'react';
import type { Product } from '../types';

export function useSearch(products: Product[]) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category).filter(Boolean) as string[]));
    return ['All', ...cats.sort()];
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return products.filter(p => {
      const categoryMatch = activeCategory === 'All' || p.category === activeCategory;
      if (!categoryMatch) return false;
      if (!q) return true;
      const nameMatch = p.name.toLowerCase().includes(q);
      const tagMatch = p.tags?.some(t => t.toLowerCase().includes(q)) ?? false;
      const catMatch = p.category?.toLowerCase().includes(q) ?? false;
      const descMatch = p.description?.toLowerCase().includes(q) ?? false;
      return nameMatch || tagMatch || catMatch || descMatch;
    });
  }, [products, query, activeCategory]);

  return { query, setQuery, activeCategory, setActiveCategory, categories, filtered };
}
