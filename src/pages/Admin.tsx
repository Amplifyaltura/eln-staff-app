import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Save, X, ArrowLeft, Package, Upload, ShieldCheck, Eye, LogOut, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../hooks/useAuth';
import AdminLogin from '../components/AdminLogin';
import AttendanceAdmin from './AttendanceAdmin';
import type { Product } from '../types';

const CATEGORIES = ['Pipes', 'Posts', 'Connectors', 'Brackets', 'Fittings', 'Accessories', 'Flat Bar', 'Other'];

interface FormState {
  name: string;
  image: string;
  category: string;
  tags: string;
  description: string;
}

const EMPTY_FORM: FormState = { name: '', image: '', category: 'Accessories', tags: '', description: '' };

export default function Admin() {
  const { user, loading: authLoading, signOut, isConfigured } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct, uploadImage } = useProducts();
  const [activeTab, setActiveTab] = useState<'products' | 'attendance'>('products');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState('All');
  const [searchQ, setSearchQ] = useState('');
  const [previewImg, setPreviewImg] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (isConfigured && !authLoading && !user) return <AdminLogin />;
  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(212,175,55,0.2)', borderTopColor: 'var(--color-gold)' }} />
    </div>
  );

  const openAdd = () => { setEditId(null); setForm(EMPTY_FORM); setPreviewImg(''); setFormError(null); setShowForm(true); };
  const openEdit = (p: Product) => { setEditId(p.id); setForm({ name: p.name, image: p.image, category: p.category || 'Other', tags: (p.tags || []).join(', '), description: p.description || '' }); setPreviewImg(p.image); setFormError(null); setShowForm(true); };

  const handleImageFile = async (file: File) => {
    setUploading(true);
    const { url, error } = await uploadImage(file);
    setUploading(false);
    if (error) { setFormError(error); return; }
    if (url) { setPreviewImg(url); setForm(f => ({ ...f, image: url })); }
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true); setFormError(null);
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const payload = { name: form.name, image: form.image, category: form.category, tags, description: form.description };
    const result = editId ? await updateProduct(editId, payload) : await addProduct(payload);
    setSaving(false);
    if (result?.error) { setFormError(result.error); }
    else { setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 2000); setShowForm(false); setEditId(null); setForm(EMPTY_FORM); }
  };

  const handleDelete = async (id: string) => { await deleteProduct(id); setDeleteConfirm(null); };

  const displayed = products.filter(p => {
    const catOk = filterCat === 'All' || p.category === filterCat;
    const q = searchQ.toLowerCase();
    return catOk && (!q || p.name.toLowerCase().includes(q));
  });

  const allCats = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean) as string[])).sort()];

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <header className="sticky top-0 z-40" style={{ background: 'var(--color-navy)', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium hover:opacity-70" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Gallery</span>
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" style={{ color: 'var(--color-gold)' }} />
            <span className="font-bold text-white">Eln Balustrade — Admin</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {user && <span className="hidden sm:block text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{user.email}</span>}
            <Link to="/" className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>
              <Eye className="w-3.5 h-3.5" /><span className="hidden sm:inline">Gallery</span>
            </Link>
            {isConfigured && user && (
              <button onClick={signOut} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)', color: 'rgba(255,120,120,0.8)' }}>
                <LogOut className="w-3.5 h-3.5" /><span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
            {activeTab === 'products' && (
              <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90" style={{ background: 'var(--color-gold)', color: '#0a1628' }}>
                <Plus className="w-4 h-4" />Add Product
              </button>
            )}
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="max-w-6xl mx-auto px-4 pb-0 flex gap-1">
          {[{ id: 'products', label: 'Products', icon: Package }, { id: 'attendance', label: 'Attendance', icon: Clock }].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all"
              style={{
                borderColor: activeTab === id ? 'var(--color-gold)' : 'transparent',
                color: activeTab === id ? 'var(--color-gold)' : 'rgba(255,255,255,0.4)',
                background: 'transparent',
              }}
            >
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[{ label: 'Total Products', value: products.length }, { label: 'Categories', value: allCats.length - 1 }, { label: 'With Images', value: products.filter(p => p.image).length }, { label: 'With Tags', value: products.filter(p => p.tags?.length).length }].map(({ label, value }) => (
                <div key={label} className="rounded-xl p-4" style={{ background: 'var(--color-card)', border: '1px solid rgba(212,175,55,0.12)' }}>
                  <div className="text-2xl font-black" style={{ color: 'var(--color-gold)' }}>{value}</div>
                  <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
                </div>
              ))}
            </div>

            <div className="mb-5 px-4 py-2.5 rounded-lg flex items-center gap-2 text-xs" style={{ background: isConfigured ? 'rgba(100,255,150,0.06)' : 'rgba(255,165,0,0.06)', border: `1px solid ${isConfigured ? 'rgba(100,255,150,0.2)' : 'rgba(255,165,0,0.2)'}`, color: isConfigured ? 'rgba(100,255,150,0.8)' : 'rgba(255,200,80,0.8)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: 'currentColor' }} />
              {isConfigured ? 'Cloud sync active — changes sync across all devices' : 'Local mode — connect Supabase for cross-device sync'}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search products…" className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.2)', color: 'white' }} />
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="px-4 py-2.5 rounded-lg text-sm outline-none" style={{ background: '#0f1e35', border: '1px solid rgba(212,175,55,0.2)', color: 'white' }}>
                {allCats.map(c => <option key={c} value={c} style={{ background: '#0a1628' }}>{c}</option>)}
              </select>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
              <div className="grid grid-cols-[48px_1fr_auto_auto] gap-0 text-xs font-bold uppercase tracking-widest px-4 py-3" style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(212,175,55,0.7)' }}>
                <span>Img</span><span>Product</span><span className="text-center">Category</span><span className="text-center">Actions</span>
              </div>
              {displayed.length === 0 ? (
                <div className="py-16 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>No products found.</div>
              ) : displayed.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="grid grid-cols-[48px_1fr_auto_auto] gap-0 items-center px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <div className="w-10 h-10 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center" style={{ color: 'rgba(212,175,55,0.3)' }}><Package className="w-4 h-4" /></div>}
                  </div>
                  <div className="pl-3 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: 'var(--color-gold)' }}>{p.name}</div>
                    {p.tags?.length ? <div className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>{p.tags.slice(0, 4).join(' · ')}</div> : null}
                  </div>
                  <div className="px-4"><span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(212,175,55,0.1)', color: 'rgba(212,175,55,0.7)' }}>{p.category || '—'}</span></div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}><Pencil className="w-3.5 h-3.5" style={{ color: 'var(--color-gold)' }} /></button>
                    <button onClick={() => setDeleteConfirm(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)' }}><Trash2 className="w-3.5 h-3.5" style={{ color: 'rgba(255,100,100,0.8)' }} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === 'attendance' && <AttendanceAdmin />}
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(5,12,25,0.9)', backdropFilter: 'blur(6px)' }} onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.92, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0 }} transition={{ type: 'spring', damping: 28, stiffness: 320 }} className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: 'var(--color-card)', border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-gold)' }}>{editId ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }}><X className="w-4 h-4 text-white" /></button>
              </div>
              {formError && <div className="mb-4 p-3 rounded-lg text-xs" style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.25)', color: 'rgba(255,120,120,0.9)' }}>{formError}</div>}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: 'rgba(212,175,55,0.8)' }}>Product Image</label>
                  <div className="relative w-full rounded-xl overflow-hidden cursor-pointer hover:opacity-90" style={{ paddingTop: '45%', background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(212,175,55,0.2)' }} onClick={() => !uploading && fileRef.current?.click()}>
                    {previewImg ? <img src={previewImg} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-2" /> : <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ color: 'rgba(212,175,55,0.4)' }}><Upload className="w-8 h-8" /><span className="text-xs">{uploading ? 'Uploading…' : 'Click to upload'}</span></div>}
                    {uploading && <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(10,22,40,0.7)' }}><div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(212,175,55,0.2)', borderTopColor: 'var(--color-gold)' }} /></div>}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageFile(e.target.files[0])} />
                  <input type="text" value={form.image} onChange={e => { setForm(f => ({ ...f, image: e.target.value })); setPreviewImg(e.target.value); }} placeholder="Or paste image URL…" className="mt-2 w-full px-3 py-2 rounded-lg text-xs outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.15)', color: 'rgba(255,255,255,0.7)' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(212,175,55,0.8)' }}>Product Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Round Aluminum Pipe 48mm" className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.2)', color: 'white' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(212,175,55,0.8)' }}>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={{ background: '#0f1e35', border: '1px solid rgba(212,175,55,0.2)', color: 'white' }}>
                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#0a1628' }}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(212,175,55,0.8)' }}>Tags (comma-separated)</label>
                  <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. round, 48mm, pipe" className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.2)', color: 'white' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(212,175,55,0.8)' }}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief product description…" rows={3} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.2)', color: 'white' }} />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>Cancel</button>
                <button onClick={handleSave} disabled={!form.name.trim() || saving} className="flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40" style={{ background: 'var(--color-gold)', color: '#0a1628' }}>
                  {saving ? <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(10,22,40,0.3)', borderTopColor: '#0a1628' }} /> : saveSuccess ? <><CheckCircle className="w-4 h-4" />Saved!</> : <><Save className="w-4 h-4" />{editId ? 'Save Changes' : 'Add Product'}</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(5,12,25,0.9)', backdropFilter: 'blur(6px)' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-sm rounded-2xl p-6 text-center" style={{ background: 'var(--color-card)', border: '1px solid rgba(255,80,80,0.3)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(255,80,80,0.1)' }}><Trash2 className="w-6 h-6" style={{ color: 'rgba(255,100,100,0.8)' }} /></div>
              <h3 className="text-lg font-bold text-white mb-2">Delete Product?</h3>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'rgba(255,80,80,0.8)', color: 'white' }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
