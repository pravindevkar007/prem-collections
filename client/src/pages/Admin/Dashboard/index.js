import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, DollarSign, Inbox, CheckCircle, Truck, XCircle } from 'lucide-react';
import API from '../../../api';
import AdminLayout from '../../../components/AdminLayout';
import { cn } from '../../../lib/utils';
import { formatPrice } from '../../../lib/currency';


const pipelineConfig = [
  { status: 'Order Received', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Inbox },
  { status: 'Confirmed', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: CheckCircle },
  { status: 'Packed', color: 'text-indigo-600 bg-indigo-50 border-indigo-200', icon: Package },
  { status: 'Shipped', color: 'text-cyan-600 bg-cyan-50 border-cyan-200', icon: Truck },
  { status: 'Out for Delivery', color: 'text-pink-600 bg-pink-50 border-pink-200', icon: Truck },
  { status: 'Delivered', color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle },
  { status: 'Cancelled', color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle },
];

const statusBadge = {
  'Order Received': 'bg-amber-100 text-amber-700', 'Confirmed': 'bg-blue-100 text-blue-700',
  'Packed': 'bg-indigo-100 text-indigo-700', 'Shipped': 'bg-cyan-100 text-cyan-700',
  'Out for Delivery': 'bg-pink-100 text-pink-700', 'Delivered': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { API.get('/orders/stats').then(r => setStats(r.data)).catch(() => {}); }, []);

  if (!stats) return <AdminLayout><div className="p-8 text-muted-foreground">Loading...</div></AdminLayout>;

  const getCount = (s) => stats.statusCounts?.find(x => x._id === s)?.count || 0;

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-5">
        <h1 className="text-lg sm:text-xl font-bold">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[
            { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-indigo-50 text-indigo-600' },
            { label: 'Revenue', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: 'bg-green-50 text-green-600' },
            { label: 'Products', value: stats.totalProducts, icon: Package, color: 'bg-amber-50 text-amber-600' },
            { label: 'Customers', value: stats.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600' },
          ].map(s => (
            <div key={s.label} className="card p-3 sm:p-5 flex items-center gap-3">
              <div className={cn("p-2 sm:p-3 rounded-xl shrink-0", s.color)}><s.icon className="h-4 w-4 sm:h-5 sm:w-5" /></div>
              <div className="min-w-0"><p className="text-lg sm:text-2xl font-bold truncate">{s.value}</p><p className="text-[11px] sm:text-xs text-muted-foreground">{s.label}</p></div>
            </div>
          ))}
        </div>

        {/* Pipeline */}
        <div>
          <h2 className="text-sm font-semibold mb-3">Order Pipeline</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-3">
            {pipelineConfig.map(p => (
              <Link key={p.status} to={`/admin/orders?status=${encodeURIComponent(p.status)}`} className={cn("card p-3 sm:p-4 text-center border hover:shadow-md transition-shadow", p.color)}>
                <p.icon className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1" />
                <p className="text-xl sm:text-2xl font-bold">{getCount(p.status)}</p>
                <p className="text-[10px] sm:text-[11px] mt-0.5 leading-tight">{p.status}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="text-sm font-semibold mb-3">Recent Orders</h2>
          <div className="card overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[500px]">
              <thead><tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Order</th><th className="text-left p-3 font-medium">Customer</th>
                <th className="text-left p-3 font-medium">Amount</th><th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Date</th>
              </tr></thead>
              <tbody>
                {stats.recentOrders.map(o => (
                  <tr key={o._id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-3 font-medium">#{o._id.slice(-8).toUpperCase()}</td>
                    <td className="p-3">{o.user?.name || 'N/A'}</td>
                    <td className="p-3 font-semibold">{formatPrice(o.totalAmount)}</td>
                    <td className="p-3"><span className={cn("badge border-0 text-[11px]", statusBadge[o.status])}>{o.status}</span></td>
                    <td className="p-3 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
