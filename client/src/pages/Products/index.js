import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, X } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../api';
import ProductCard from '../../components/ProductCard';
import { cn } from '../../lib/utils';

const categories = ['All', 'Men', 'Women', 'Kids', 'Accessories'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

function FilterContent({ search, category, updateParam, clearFilters, hasFilters, onClose }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Search</label>
        <input type="text" placeholder="Search products..." value={search}
          onChange={e => updateParam('search', e.target.value)} className="input mt-2" />
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</label>
        <div className="mt-2 space-y-1">
          {categories.map(c => (
            <button key={c} onClick={() => { updateParam('category', c); onClose(); }}
              className={cn("w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors",
                category === c ? "bg-indigo-600 text-white font-medium" : "hover:bg-slate-100 text-slate-600")}>
              {c}
            </button>
          ))}
        </div>
      </div>
      {hasFilters && (
        <button onClick={() => { clearFilters(); onClose(); }} className="btn-ghost text-destructive text-sm w-full gap-1">
          <X className="h-3.5 w-3.5" /> Clear All Filters
        </button>
      )}
    </div>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== 'All') params.category = category;
    if (search) params.search = search;
    if (sort !== 'newest') params.sort = sort;
    API.get('/products', { params })
      .then(res => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, search, sort]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== 'newest') params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});
  const hasFilters = category !== 'All' || search || sort !== 'newest';
  const filterProps = { search, category, updateParam, clearFilters, hasFilters };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">
            {search ? `Results for "${search}"` : category !== 'All' ? category : 'All Products'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFiltersOpen(true)} className="btn-outline gap-2 md:hidden text-sm">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <select value={sort} onChange={e => updateParam('sort', e.target.value)} className="input w-auto text-sm">
            {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white p-5 overflow-y-auto animate-slide-in-left shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <FilterContent {...filterProps} onClose={() => setFiltersOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="w-56 shrink-0 hidden md:block">
          <FilterContent {...filterProps} onClose={() => {}} />
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {category !== 'All' && (
                <span className="badge bg-indigo-600 text-white border-0 gap-1">
                  {category} <button onClick={() => updateParam('category', 'All')}><X className="h-3 w-3" /></button>
                </span>
              )}
              {search && (
                <span className="badge bg-secondary border-0 gap-1">
                  "{search}" <button onClick={() => updateParam('search', '')}><X className="h-3 w-3" /></button>
                </span>
              )}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-muted" />
                  <div className="p-3 sm:p-4 space-y-2">
                    <div className="h-3 bg-muted rounded w-1/3" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="rounded-full bg-muted p-6 w-fit mx-auto mb-4"><Grid3X3 className="h-10 w-10 text-muted-foreground" /></div>
              <h3 className="font-medium text-lg">No products found</h3>
              <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters</p>
              <button onClick={clearFilters} className="btn-outline mt-4">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {products.map((p, i) => (
                <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <ProductCard product={p} index={i} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
