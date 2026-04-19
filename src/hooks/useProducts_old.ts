import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'elnBalustrade_products';
const PRODUCTS_URL = '/products.json';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    // If Supabase is configured, load from DB
    if (isSupabaseConfigured && supabase) {
      const { data, error: dbError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!dbError && data) {
        const mapped: Product[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          image: row.image ?? '',
          category: row.category ?? '',
          tags: row.tags ?? [],
          description: row.description ?? '',
        }));
        setProducts(mapped);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        setLoading(false);
        return;
      }
    }

    // Fallback: fetch from products.json
    try {
      const res = await fetch(PRODUCTS_URL, { cache: 'no-cache' });
      if (!res.ok) throw new Error('Network error');
      const data: Product[] = await res.json();
      setProducts(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        setProducts(JSON.parse(cached));
      } else {
        setError('Unable to load products. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .insert([{ name: product.name, image: product.image, category: product.category, tags: product.tags, description: product.description }])
        .select()
        .single();
      if (!error && data) {
        const newProduct: Product = { id: data.id, name: data.name, image: data.image ?? '', category: data.category ?? '', tags: data.tags ?? [], description: data.description ?? '' };
        setProducts(prev => {
          const updated = [newProduct, ...prev];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        return { error: null };
      }
      return { error: error?.message ?? 'Failed to add product' };
    }
    // Local fallback
    const newProduct: Product = { ...product, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) };
    setProducts(prev => {
      const updated = [newProduct, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    return { error: null };
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').update(updates).eq('id', id);
      if (error) return { error: error.message };
    }
    setProducts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    return { error: null };
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) return { error: error.message };
    }
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    return { error: null };
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<{ url: string | null; error: string | null }> => {
    if (!isSupabaseConfigured || !supabase) {
      // Local fallback: convert to base64
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => resolve({ url: e.target?.result as string, error: null });
        reader.onerror = () => resolve({ url: null, error: 'Failed to read file' });
        reader.readAsDataURL(file);
      });
    }
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(filename, file, { upsert: true });
    if (error) return { url: null, error: error.message };
    const { data } = supabase.storage.from('product-images').getPublicUrl(filename);
    return { url: data.publicUrl, error: null };
  }, []);

  return { products, loading, error, reload: loadProducts, addProduct, updateProduct, deleteProduct, uploadImage };
}
