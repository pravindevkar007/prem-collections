import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-extrabold">Prem Collections</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Discover the latest trends in fashion. Quality clothing for everyone at unbeatable prices.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Quick Links</h3>
            <nav className="flex flex-col gap-3">
              {[['All Products', '/products'], ['Men', '/products?category=Men'], ['Women', '/products?category=Women'], ['Kids', '/products?category=Kids']].map(([label, to]) => (
                <Link key={label} to={to} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Customer Service</h3>
            <nav className="flex flex-col gap-3">
              {['Track Order', 'Shipping Policy', 'Returns & Exchanges', 'FAQ'].map(item => (
                <span key={item} className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">{item}</span>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Contact Us</h3>
            <div className="flex flex-col gap-3">
              {[
                { icon: Mail, text: 'support@shopstyle.com' },
                { icon: Phone, text: '+1 (555) 123-4567' },
                { icon: MapPin, text: '123 Fashion St, NY 10001' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-slate-400">
                  <Icon className="h-4 w-4 text-indigo-400 shrink-0" /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Prem Collections. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
