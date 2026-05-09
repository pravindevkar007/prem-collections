import { useState, useEffect, useRef } from 'react';
import { Edit2, Trash2, Plus, X, Upload, Camera, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../../../api';
import AdminLayout from '../../../components/AdminLayout';
import { formatPrice } from '../../../lib/currency';

const emptyProduct = { name: '', description: '', price: '', originalPrice: '', image: '', category: 'Men', sizes: '', colors: '', stock: '', featured: false };

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  const loadProducts = () => API.get('/products').then(r => setProducts(r.data));
  useEffect(() => { loadProducts(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyProduct); setPreview(''); setModal(true); };
  const openEdit = p => {
    setEditing(p._id);
    setForm({ name: p.name, description: p.description, price: p.price, originalPrice: p.originalPrice || '', image: p.image, category: p.category, sizes: p.sizes.join(', '), colors: p.colors.join(', '), stock: p.stock, featured: p.featured });
    setPreview(p.image);
    setModal(true);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    // Upload to server
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const fullUrl = `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${data.imageUrl}`;
      setForm(f => ({ ...f, image: fullUrl }));
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Image upload failed');
      setPreview('');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.image) return toast.error('Please upload a product image');
    const data = { ...form, price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined, stock: Number(form.stock), sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean), colors: form.colors.split(',').map(c => c.trim()).filter(Boolean) };
    try {
      if (editing) { await API.put(`/products/${editing}`, data); toast.success('Updated'); }
      else { await API.post('/products', data); toast.success('Added'); }
      setModal(false); loadProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    try { await API.delete(`/products/${id}`); toast.success('Deleted'); loadProducts(); } catch { toast.error('Failed'); }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-lg sm:text-xl font-bold">Products</h1>
          <button onClick={openAdd} className="btn-primary gap-1.5 text-sm"><Plus className="h-4 w-4" /> Add Product</button>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[500px]">
            <thead><tr className="border-b bg-slate-50">
              <th className="text-left p-3 font-medium">Product</th><th className="text-left p-3 font-medium">Category</th>
              <th className="text-left p-3 font-medium">Price</th><th className="text-left p-3 font-medium">Stock</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className="border-b last:border-0 hover:bg-slate-50/50">
                  <td className="p-3"><div className="flex items-center gap-3"><img src={p.image} alt={p.name} className="h-10 w-10 rounded-md object-cover" /><span className="font-medium">{p.name}</span></div></td>
                  <td className="p-3"><span className="badge bg-slate-100 text-slate-700 border-0">{p.category}</span></td>
                  <td className="p-3 font-semibold">{formatPrice(p.price)}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">
                    <button onClick={() => openEdit(p)} className="btn-ghost p-1.5"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(p._id)} className="btn-ghost p-1.5 text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setModal(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-lg">{editing ? 'Edit' : 'Add'} Product</h2>
                <button onClick={() => setModal(false)} className="btn-ghost p-1 rounded-full"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-2">Product Image</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-indigo-300 transition-colors">
                    {preview ? (
                      <div className="relative inline-block">
                        <img src={preview} alt="Preview" className="h-40 w-40 object-cover rounded-xl mx-auto shadow-md" />
                        <button type="button" onClick={() => { setPreview(''); setForm(f => ({ ...f, image: '' })); }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="py-6">
                        <ImageIcon className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-500 mb-3">Upload product photo</p>
                      </div>
                    )}
                    <div className="flex justify-center gap-3 mt-3">
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />
                      <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                        <Upload className="h-4 w-4" /> {uploading ? 'Uploading...' : 'Choose File'}
                      </button>
                      <button type="button" onClick={() => cameraRef.current?.click()} disabled={uploading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors">
                        <Camera className="h-4 w-4" /> Camera
                      </button>
                    </div>
                  </div>
                </div>

                <div><label className="text-xs font-medium text-slate-500">Name</label><input name="name" value={form.name} onChange={handleChange} required className="input h-10 mt-1" /></div>
                <div><label className="text-xs font-medium text-slate-500">Description</label><textarea name="description" value={form.description} onChange={handleChange} required className="input mt-1 min-h-[60px] py-2" /></div>
                <div><label className="text-xs font-medium text-slate-500">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="input h-10 mt-1">
                    <option>Men</option><option>Women</option><option>Kids</option><option>Accessories</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-slate-500">Price (₹)</label><input name="price" type="number" step="1" value={form.price} onChange={handleChange} required className="input h-10 mt-1" placeholder="1499" /></div>
                  <div><label className="text-xs font-medium text-slate-500">MRP / Original Price (₹)</label><input name="originalPrice" type="number" step="1" value={form.originalPrice} onChange={handleChange} className="input h-10 mt-1" placeholder="2499" /></div>
                </div>
                <div><label className="text-xs font-medium text-slate-500">Stock</label><input name="stock" type="number" value={form.stock} onChange={handleChange} required className="input h-10 mt-1" /></div>
                <div><label className="text-xs font-medium text-slate-500">Sizes (comma separated)</label><input name="sizes" value={form.sizes} onChange={handleChange} placeholder="S, M, L, XL" className="input h-10 mt-1" /></div>
                <div><label className="text-xs font-medium text-slate-500">Colors (comma separated)</label><input name="colors" value={form.colors} onChange={handleChange} placeholder="Black, White, Red" className="input h-10 mt-1" /></div>
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /> Featured Product</label>
                <button type="submit" disabled={uploading} className="btn-primary w-full h-11 text-base">{editing ? 'Update' : 'Add'} Product</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
