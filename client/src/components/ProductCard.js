import { Link } from 'react-router-dom';
import { Star, Eye } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatPrice } from '../lib/currency';

export default function ProductCard({ product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group card overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {discount > 0 && (
            <span className="absolute top-3 left-3 badge bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-md">
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="absolute top-3 right-3 badge bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 shadow-md">
              Featured
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-5">
            <span className="bg-white text-foreground px-5 py-2.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <Eye className="h-3.5 w-3.5" /> Quick View
            </span>
          </div>
        </div>

        <div className="p-4 space-y-2.5">
          <span className="badge bg-muted text-muted-foreground border-0 text-[10px]">
            {product.category}
          </span>
          <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("h-3 w-3", i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200")} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.numReviews})</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
