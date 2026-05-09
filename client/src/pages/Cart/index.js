import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/currency';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-full bg-muted p-8 w-fit mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet</p>
          <Link to="/products" className="btn-primary h-11 px-8 gap-2">
            Start Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Shopping Cart ({cartCount} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, i) => (
            <motion.div
              key={item.cartId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-3 sm:p-4 flex gap-3 sm:gap-4"
            >
              <img src={item.image} alt={item.name} className="h-24 w-20 sm:h-28 sm:w-24 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/products/${item._id}`} className="font-medium hover:underline line-clamp-1">{item.name}</Link>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.size} • {item.color}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.cartId)} className="btn-ghost p-1.5 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border rounded-md">
                    <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="p-2 hover:bg-muted transition-colors">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-4 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="p-2 hover:bg-muted transition-colors">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="text-lg font-bold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24 space-y-4">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({cartCount} items)</span>
                <span className="font-medium">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (GST 18%)</span>
                <span className="font-medium">{formatPrice(cartTotal * 0.18)}</span>
              </div>
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">{formatPrice(cartTotal * 1.18)}</span>
            </div>
            <Link to="/checkout" className="btn-primary w-full h-11 text-base gap-2">
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/products" className="btn-ghost w-full text-sm text-muted-foreground">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
