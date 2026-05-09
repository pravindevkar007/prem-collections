import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Search, Menu, X, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount, openDrawer } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => { logout(); navigate('/'); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  if (user?.isAdmin) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md shadow-indigo-200">
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">Prem Collections</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="btn-primary gap-2 text-xs h-9 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600">
              <Settings className="h-3.5 w-3.5" /> Admin Panel
            </Link>
            <span className="text-sm text-muted-foreground hidden sm:inline">Hi, {user.name}</span>
            <button onClick={handleLogout} className="btn-ghost p-2 rounded-full" title="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md shadow-indigo-200">
            <ShoppingBag className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">Prem Collections</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {[
            { to: '/', label: 'Home' },
            { to: '/products', label: 'Products' },
            { to: '/products?category=Men', label: 'Men' },
            { to: '/products?category=Women', label: 'Women' },
            { to: '/products?category=Kids', label: 'Kids' },
          ].map(link => (
            <Link key={link.label} to={link.to}
              className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-full transition-all hover:text-foreground hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div className="relative">
            <button onClick={() => setSearchOpen(!searchOpen)} className="btn-ghost p-2.5 rounded-full">
              <Search className="h-4 w-4" />
            </button>
            {searchOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSearchOpen(false)} />
                <form onSubmit={handleSearch} className="absolute right-0 top-14 z-50 animate-scale-in w-[calc(100vw-2rem)] sm:w-72 max-w-sm">
                  <input type="text" placeholder="Search products..." value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="input h-11 shadow-xl rounded-xl border-2 w-full"
                    autoFocus
                  />
                </form>
              </>
            )}
          </div>

          <button onClick={openDrawer} className="btn-ghost p-2.5 rounded-full relative">
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-0 -right-0 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-[10px] font-bold text-white animate-bounce-in shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="hidden md:flex items-center gap-1">
              <Link to="/orders" className="btn-ghost px-3 py-2 text-sm rounded-full">My Orders</Link>
              <span className="text-sm text-muted-foreground px-2 hidden lg:inline">Hi, {user.name}</span>
              <button onClick={handleLogout} className="btn-ghost p-2.5 rounded-full" title="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-ghost p-2.5 rounded-full">
              <User className="h-4 w-4" />
            </Link>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="btn-ghost p-2.5 rounded-full lg:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t animate-fade-in bg-white">
          <nav className="container mx-auto flex flex-col p-4 gap-1">
            {['Home:/', 'Products:/products', 'Men:/products?category=Men', 'Women:/products?category=Women', 'Kids:/products?category=Kids'].map(item => {
              const [label, to] = item.split(':');
              return (
                <Link key={label} to={to} onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-muted transition-colors"
                >{label}</Link>
              );
            })}
            {user ? (
              <>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-muted">My Orders</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-red-50 text-left text-destructive"
                >Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
              >Sign In</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
