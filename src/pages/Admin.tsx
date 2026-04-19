import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

type Product = {
  id: string;
  name: string;
  category: string;
  description?: string;
};

export default function Admin() {
  const { user, logout, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', description: '' });
  const [activeTab, setActiveTab] = useState<'products' | 'attendance'>('products');
  const [loading, setLoading] = useState(false);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*');
    if (data) setProducts(data);
  };

  useEffect(() => {
    if (isAdmin) fetchProducts();
  }, [isAdmin]);

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.category) return;

    setLoading(true);
    const { error } = await supabase
      .from('products')
      .insert([newProduct]);

    if (!error) {
      setNewProduct({ name: '', category: '', description: '' });
      fetchProducts();
    } else {
      alert('Error adding product: ' + error.message);
    }
    setLoading(false);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  if (!isAdmin) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>Access Denied. Please login as Admin.</div>;
  }

  return (
    <div style={{ background: '#0b1729', minHeight: '100vh', color: '#e0e0e0' }}>
      <header style={{
        background: 'rgba(11, 23, 41, 0.98)',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <h1 style={{ color: '#d4af37', margin: 0 }}>Admin Dashboard</h1>
        <div>
          <span style={{ marginRight: '25px', color: '#aaa' }}>
            Logged in as: <strong>{user?.email}</strong>
          </span>
          <button onClick={logout} style={{
            padding: '10px 20px',
            background: '#d4af37',
            color: '#0b1729',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Logout
          </button>
        </div>
      </header>

      <div style={{ padding: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '1px solid #334155' }}>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'products' ? '#d4af37' : '#1e2a4a',
              color: activeTab === 'products' ? '#0b1729' : '#d4af37',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Manage Products
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'attendance' ? '#d4af37' : '#1e2a4a',
              color: activeTab === 'attendance' ? '#0b1729' : '#d4af37',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            View Attendance
          </button>
        </div>

        {activeTab === 'products' && (
          <div>
            <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>Add New Product</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '10px', marginBottom: '30px' }}>
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                style={{ padding: '14px', borderRadius: '8px', background: '#1e2a4a', border: 'none', color: 'white' }}
              />
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                style={{ padding: '14px', borderRadius: '8px', background: '#1e2a4a', border: 'none', color: 'white' }}
              />
              <button
                onClick={addProduct}
                disabled={loading}
                style={{
                  padding: '14px 28px',
                  background: '#d4af37',
                  color: '#0b1729',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Add Product
              </button>
            </div>

            <h3 style={{ color: '#d4af37', marginBottom: '15px' }}>Existing Products ({products.length})</h3>
            
            <div style={{ background: '#112240', borderRadius: '12px', overflow: 'hidden' }}>
              {products.map(product => (
                <div key={product.id} style={{
                  padding: '15px 20px',
                  borderBottom: '1px solid #334155',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong>{product.name}</strong>
                    <span style={{ marginLeft: '15px', color: '#aaa' }}>{product.category}</span>
                  </div>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    style={{ color: '#ff6b6b', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div>
            <h2 style={{ color: '#d4af37' }}>Staff Attendance Records</h2>
            <Link to="/attendance-admin" style={{
              display: 'inline-block',
              marginTop: '15px',
              padding: '12px 24px',
              background: '#d4af37',
              color: '#0b1729',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600'
            }}>
              View Full Attendance Records →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
