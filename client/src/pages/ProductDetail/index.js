import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingBag, Truck, RotateCcw, Shield, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import API from '../../api';
import { useCart } from '../../context/CartContext';
import { cn } from '../../lib/utils';
import { formatPrice } from '../../lib/currency';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);
  const [imgHover, setImgHover] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    API.get(`/products/${id}`).then(res => {
      setProduct(res.data);
      setSize(res.data.sizes[0] || '');
      setColor(res.data.colors[0] || '');
    }).catch(() => navigate('/products'));
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-muted rounded-2xl" />
          <div className="space-y-4 py-4">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-8 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-20 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = () => {
    addToCart(product, size, color, qty);
    setAdded(true);
    toast.success('Added to cart!');
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-1 scrollbar-none">
        <Link to="/" className="hover:text-foreground transition-colors shrink-0">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to={`/products?category=${product.category}`} className="hover:text-foreground transition-colors">{product.category}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium truncate max-w-[120px] sm:max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-square rounded-2xl overflow-hidden bg-muted"
          onMouseEnter={() => setImgHover(true)}
          onMouseLeave={() => setImgHover(false)}
        >
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "h-full w-full object-cover transition-transform duration-700",
              imgHover && "scale-110"
            )}
          />
          {discount > 0 && (
            <span className="absolute top-4 left-4 badge bg-destructive text-destructive-foreground border-0 text-sm px-3 py-1">
              -{discount}% OFF
            </span>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <span className="badge bg-secondary border-0 mb-3">{product.category}</span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-slate-200 text-slate-200"
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">({product.numReviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
            {discount > 0 && (
            <span className="badge bg-indigo-50 text-indigo-700 border-indigo-200">Save {formatPrice(product.originalPrice - product.price)}</span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={cn(
              "h-2 w-2 rounded-full",
              product.stock > 10 ? "bg-emerald-500" : product.stock > 0 ? "bg-amber-500" : "bg-red-500"
            )} />
            <span className="text-sm">
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
            </span>
          </div>

          {/* Size */}
          {product.sizes.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "h-10 min-w-[44px] px-3 rounded-md border text-sm font-medium transition-all",
                      size === s
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-200 hover:border-indigo-300"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color */}
          {product.colors.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Color: <span className="text-muted-foreground font-normal">{color}</span></label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      "px-4 py-2 rounded-md border text-sm transition-all",
                      color === c
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-medium"
                        : "border-slate-200 hover:border-indigo-300"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <div className="flex items-center border rounded-md self-start">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-3 hover:bg-muted transition-colors touch-manipulation">
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-5 font-medium text-sm min-w-[40px] text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="p-3 hover:bg-muted transition-colors touch-manipulation">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={cn(
                "btn-primary h-12 px-6 sm:px-8 flex-1 text-sm sm:text-base gap-2 transition-all",
                added && "!bg-emerald-500 hover:!bg-emerald-500"
              )}
            >
              {added ? (
                <><Check className="h-5 w-5" /> Added!</>
              ) : product.stock === 0 ? (
                'Out of Stock'
              ) : (
                <><ShoppingBag className="h-5 w-5" /> Add to Cart</>
              )}
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">30-Day Returns</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Secure Checkout</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
