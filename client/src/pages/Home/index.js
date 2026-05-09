import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RotateCcw, Headphones, ChevronRight, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../api';
import ProductCard from '../../components/ProductCard';

const categories = [
  { name: 'Men', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400', desc: 'Suits, shirts & more', gradient: 'from-blue-600 to-indigo-700' },
  { name: 'Women', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', desc: 'Dresses, tops & more', gradient: 'from-pink-500 to-rose-600' },
  { name: 'Kids', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400', desc: 'Fun & colorful styles', gradient: 'from-amber-500 to-orange-600' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', desc: 'Bags, belts & more', gradient: 'from-emerald-500 to-teal-600' },
];

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50', color: 'bg-blue-50 text-blue-600' },
  { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout', color: 'bg-green-50 text-green-600' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy', color: 'bg-purple-50 text-purple-600' },
  { icon: Headphones, title: '24/7 Support', desc: 'Dedicated support', color: 'bg-orange-50 text-orange-600' },
];

const testimonials = [
  { name: 'Sarah M.', text: 'Amazing quality and fast delivery! The clothes fit perfectly.', rating: 5 },
  { name: 'James K.', text: 'Best online shopping experience. Great customer service too!', rating: 5 },
  { name: 'Emily R.', text: 'Love the variety and the prices are unbeatable. Highly recommend!', rating: 4 },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    API.get('/products/featured').then(res => setFeatured(res.data)).catch(() => {});
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600')] bg-cover bg-center opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent" />
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 mb-6"
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-white/90 font-medium">New Collection 2025</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Elevate Your{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Personal Style
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-lg leading-relaxed">
              Discover curated collections of premium fashion at prices you'll love. Free shipping on your first order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-10 h-14 text-base font-semibold text-slate-900 shadow-xl shadow-white/10 transition-all duration-200 hover:bg-slate-100 hover:-translate-y-0.5">
                Shop Now <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/products?category=Women" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-transparent px-10 h-14 text-base font-semibold text-white transition-all duration-200 hover:bg-white/15 hover:border-white/50 backdrop-blur-sm">
                Women's Collection
              </Link>
            </div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="flex gap-8 mt-14 pt-8 border-t border-white/10"
            >
              {[{ num: '10K+', label: 'Happy Customers' }, { num: '500+', label: 'Products' }, { num: '4.9', label: 'Avg Rating' }].map(s => (
                <div key={s.label}>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{s.num}</p>
                  <p className="text-sm text-slate-400">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8"
          >
            {features.map(({ icon: Icon, title, desc, color }) => (
              <motion.div key={title} variants={item}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className={`rounded-xl p-3 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">Shop by Category</h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">Find what suits your style from our curated collections</p>
        </motion.div>
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {categories.map((cat) => (
            <motion.div key={cat.name} variants={item}>
              <Link to={`/products?category=${cat.name}`}
                className="group relative block aspect-[3/4] rounded-2xl overflow-hidden shadow-lg"
              >
                <img src={cat.image} alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-60 group-hover:opacity-70 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                  <h3 className="text-white text-xl sm:text-2xl font-bold">{cat.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{cat.desc}</p>
                  <span className="inline-flex items-center gap-1 text-white text-sm font-semibold mt-3 group-hover:gap-3 transition-all duration-300">
                    Shop Now <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground mt-2">Handpicked just for you</p>
            </motion.div>
            <Link to="/products" className="btn-outline rounded-full gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {featured.map((p, i) => (
              <motion.div key={p._id} variants={item}>
                <ProductCard product={p} index={i} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">What Our Customers Say</h2>
          <p className="text-muted-foreground mt-3">Trusted by thousands of happy shoppers</p>
        </motion.div>
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={item}
              className="card p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {t.name[0]}
                </div>
                <span className="font-semibold text-sm">{t.name}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-10 sm:p-16"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          <div className="relative text-center max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Get 20% Off Your First Order
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Join our newsletter for exclusive deals and early access to new arrivals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 rounded-full px-6 bg-white/15 border-2 border-white/20 text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-white/50"
              />
              <button className="inline-flex items-center justify-center rounded-full bg-white px-8 h-12 font-bold text-indigo-700 shadow-xl transition-all duration-200 hover:bg-slate-100 hover:-translate-y-0.5">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
