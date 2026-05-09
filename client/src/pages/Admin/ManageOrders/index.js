import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../../../api';
import AdminLayout from '../../../components/AdminLayout';
import { cn } from '../../../lib/utils';
import { formatPrice } from '../../../lib/currency';

const allStatuses = ['All', 'Order Received', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
const statusOptions = allStatuses.filter(s => s !== 'All');
const statusBadge = {
  'Order Received': 'bg-amber-100 text-amber-700', 'Confirmed': 'bg-blue-100 text-blue-700',
  'Packed': 'bg-indigo-100 text-indigo-700', 'Shipped': 'bg-cyan-100 text-cyan-700',
  'Out for Delivery': 'bg-pink-100 text-pink-700', 'Delivered': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
};

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get('status') || 'All';

  useEffect(() => {
    const params = activeFilter !== 'All' ? { status: activeFilter } : {};
    API.get('/orders/all', { params }).then(r => setOrders(r.data)).catch(() => {});
  }, [activeFilter]);

  const setFilter = s => { if (s === 'All') setSearchParams({}); else setSearchParams({ status: s }); };

  const handleUpdate = async (id, updates) => {
    try {
      await API.put(`/orders/${id}/status`, updates);
      toast.success('Updated');
      const params = activeFilter !== 'All' ? { status: activeFilter } : {};
      API.get('/orders/all', { params }).then(r => setOrders(r.data)).catch(() => {});
    }
    catch { toast.error('Failed'); }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-4">
        <h1 className="text-lg sm:text-xl font-bold">Manage Orders</h1>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {allStatuses.map(s => (
            <button key={s} onClick={() => setFilter(s)} className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              activeFilter === s ? "bg-indigo-600 text-white border-indigo-600" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
            )}>{s}</button>
          ))}
        </div>

        {orders.length === 0 ? (
          <p className="text-center py-16 text-muted-foreground">No orders found.</p>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order._id} className="card overflow-hidden">
                <button onClick={() => setExpanded(expanded === order._id ? null : order._id)} className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 hover:bg-muted/30 transition-colors text-left gap-2">
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    <span className="font-semibold text-xs sm:text-sm">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className={cn("badge border-0 text-[11px]", statusBadge[order.status])}>{order.status}</span>
                    <span className="text-sm font-medium">{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 self-end sm:self-auto">
                    <span className="text-xs sm:text-sm text-muted-foreground">{order.user?.name} • {new Date(order.createdAt).toLocaleDateString()}</span>
                    {expanded === order._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                {expanded === order._id && (
                  <div className="border-t p-4 sm:p-5 space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Items</h4>
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 py-2 text-sm">
                            <img src={item.image} alt={item.name} className="h-10 w-10 rounded-md object-cover" />
                            <div className="flex-1"><p className="font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.size}/{item.color} × {item.quantity}</p></div>
                            <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                        <p className="text-right font-bold text-lg mt-2">Total: {formatPrice(order.totalAmount)}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Shipping</h4>
                        <div className="bg-muted/50 rounded-lg p-4 text-sm flex gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{order.shippingAddress.fullName}</p>
                            <p className="text-muted-foreground">{order.shippingAddress.address}<br />{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />Phone: {order.shippingAddress.phone}</p>
                          </div>
                        </div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-2">Customer</h4>
                        <p className="text-sm">{order.user?.name} <span className="text-muted-foreground">({order.user?.email})</span></p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-end pt-3 border-t">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Status</label>
                        <select defaultValue={order.status} onChange={e => handleUpdate(order._id, { status: e.target.value })} className="input h-9 w-auto">
                          {statusOptions.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Est. Days</label>
                        <input type="number" min="1" defaultValue={order.estimatedDays || 7} onBlur={e => handleUpdate(order._id, { estimatedDays: Number(e.target.value) })} className="input h-9 w-20" />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Note to Customer</label>
                        <input defaultValue={order.adminNotes || ''} placeholder="Add a note..." onBlur={e => handleUpdate(order._id, { adminNotes: e.target.value })} className="input h-9" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
