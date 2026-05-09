import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Lock, MapPin, Phone, User, Building, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../api';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/currency';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', address: '', city: '', state: '', zipCode: '', phone: '' });
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (cart.length === 0) return toast.error('Cart is empty');
    setLoading(true);
    try {
      const items = cart.map(i => ({ product: i._id, name: i.name, image: i.image, price: i.price, size: i.size, color: i.color, quantity: i.quantity }));
      await API.post('/orders', { items, shippingAddress: form, totalAmount: cartTotal, paymentMethod: 'COD' });
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  const fields = [
    { name: 'fullName', placeholder: 'Full Name', icon: User, full: true },
    { name: 'address', placeholder: 'Street Address', icon: MapPin, full: true },
    { name: 'city', placeholder: 'City', icon: Building },
    { name: 'state', placeholder: 'State', icon: Building },
    { name: 'zipCode', placeholder: 'Zip Code', icon: Hash },
    { name: 'phone', placeholder: 'Phone Number', icon: Phone },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl sm:text-3xl font-bold mb-8">Checkout</motion.h1>
      <div className="grid lg:grid-cols-5 gap-8">
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 space-y-6"
        >
          <div className="card p-6 sm:p-8 space-y-5 border-0 shadow-lg">
            <h2 className="font-semibold text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-indigo-600" /> Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(f => (
                <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
                  <div className="relative">
                    <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input name={f.name} placeholder={f.placeholder} value={form[f.name]} onChange={handleChange} required
                      className="input h-12 pl-10 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="btn-primary w-full h-13 py-3.5 rounded-xl text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200"
          >
            <Lock className="h-4 w-4" /> {loading ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
          </button>
        </motion.form>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <div className="card p-6 sm:p-8 space-y-5 sticky top-24 border-0 shadow-lg">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map(i => (
                <div key={i.cartId} className="flex gap-3 text-sm">
                  <img src={i.image} alt={i.name} className="h-16 w-14 rounded-xl object-cover shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{i.name}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{i.size} • {i.color} × {i.quantity}</p>
                  </div>
                  <span className="font-semibold">{formatPrice(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{formatPrice(cartTotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-medium text-green-600">Free</span></div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t"><span>Total</span><span>{formatPrice(cartTotal)}</span></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
