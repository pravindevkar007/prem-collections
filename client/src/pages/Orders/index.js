import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, Package, Truck, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../api';
import { cn } from '../../lib/utils';
import { formatPrice } from '../../lib/currency';

const pipeline = ['Order Received', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
const stepIcons = { 'Order Received': Package, 'Confirmed': CheckCircle2, 'Packed': Package, 'Shipped': Truck, 'Out for Delivery': Truck, 'Delivered': CheckCircle2 };

const statusColors = {
  'Order Received': 'bg-amber-100 text-amber-700', 'Confirmed': 'bg-blue-100 text-blue-700',
  'Packed': 'bg-indigo-100 text-indigo-700', 'Shipped': 'bg-cyan-100 text-cyan-700',
  'Out for Delivery': 'bg-pink-100 text-pink-700', 'Delivered': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
};

function getEstDate(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + (days || 7));
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/my-orders').then(res => setOrders(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="rounded-full bg-muted p-8 w-fit mx-auto mb-6"><Package className="h-12 w-12 text-muted-foreground" /></div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">No orders yet</h2>
        <p className="text-muted-foreground text-sm">Start shopping to see your orders here!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-5">
        {orders.map((order, oi) => {
          const isCancelled = order.status === 'Cancelled';
          const currentIdx = pipeline.indexOf(order.status);

          return (
            <motion.div key={order._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: oi * 0.08 }} className="card overflow-hidden">
              {/* Header */}
              <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30">
                <div>
                  <p className="font-semibold text-sm sm:text-base">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <span className={cn("badge border-0 text-[11px]", statusColors[order.status])}>{order.status}</span>
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                {/* Timeline - scrollable on mobile */}
                {!isCancelled && (
                  <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-2">
                    <div className="flex items-center justify-between relative" style={{ minWidth: '480px' }}>
                      <div className="absolute top-4 left-[8%] right-[8%] h-0.5 bg-slate-200">
                        <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${currentIdx >= 0 ? (currentIdx / (pipeline.length - 1)) * 100 : 0}%` }} />
                      </div>
                      {pipeline.map((step, i) => {
                        const Icon = stepIcons[step] || Circle;
                        const done = i < currentIdx;
                        const current = i === currentIdx;
                        return (
                          <div key={step} className="flex flex-col items-center z-10 flex-1">
                            <div className={cn(
                              "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all",
                              done ? "bg-indigo-600 text-white" : current ? "bg-indigo-600 text-white ring-4 ring-indigo-100" : "bg-slate-100 text-slate-400"
                            )}>
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <span className={cn("text-[9px] sm:text-[10px] mt-1 text-center leading-tight", (done || current) ? "font-medium text-foreground" : "text-muted-foreground")}>{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isCancelled && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                    <XCircle className="h-4 w-4 shrink-0" /> This order has been cancelled.
                  </div>
                )}

                {!isCancelled && order.status !== 'Delivered' && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 text-green-700 text-xs sm:text-sm">
                    <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>Estimated delivery by {getEstDate(order.createdAt, order.estimatedDays)} ({order.estimatedDays || 7} days)</span>
                  </div>
                )}

                {order.status === 'Delivered' && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-700 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0" /> Delivered successfully!
                  </div>
                )}

                {order.adminNotes && (
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-700 text-xs sm:text-sm">
                    <span className="font-medium text-xs block mb-1">Update from Prem Collections:</span>
                    {order.adminNotes}
                  </div>
                )}

                {/* Items */}
                <div className="space-y-2.5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <img src={item.image} alt={item.name} className="h-11 w-11 sm:h-12 sm:w-12 rounded-md object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-xs sm:text-sm">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground">{item.size} / {item.color} × {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-xs sm:text-sm shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="text-right text-base sm:text-lg font-bold pt-3 border-t">Total: {formatPrice(order.totalAmount)}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
