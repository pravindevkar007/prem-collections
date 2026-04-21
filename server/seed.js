const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const connectDB = require('./config/db');

const products = [
  {
    name: 'Classic White Oxford Shirt',
    description: 'A timeless white oxford shirt crafted from premium cotton. Perfect for both casual and formal occasions with a comfortable regular fit.',
    price: 1499, originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500',
    category: 'Men', sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Blue', 'Pink'],
    stock: 50, rating: 4.5, numReviews: 128, featured: true,
  },
  {
    name: 'Slim Fit Dark Denim Jeans',
    description: 'Modern slim fit jeans in dark wash denim. Features stretch fabric for all-day comfort with a sleek silhouette.',
    price: 1999, originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    category: 'Men', sizes: ['28', '30', '32', '34', '36'], colors: ['Dark Blue', 'Black'],
    stock: 75, rating: 4.3, numReviews: 95, featured: true,
  },
  {
    name: 'Floral Summer Maxi Dress',
    description: 'Elegant floral print maxi dress perfect for summer outings. Lightweight fabric with a flattering A-line silhouette.',
    price: 2499, originalPrice: 4999,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500',
    category: 'Women', sizes: ['XS', 'S', 'M', 'L'], colors: ['Floral Blue', 'Floral Pink'],
    stock: 40, rating: 4.7, numReviews: 203, featured: true,
  },
  {
    name: 'Leather Biker Jacket',
    description: 'Premium faux leather biker jacket with asymmetric zip closure. Edgy style meets everyday wearability.',
    price: 4999, originalPrice: 8999,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
    category: 'Men', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Brown'],
    stock: 30, rating: 4.6, numReviews: 87, featured: true,
  },
  {
    name: 'Cashmere Blend Sweater',
    description: 'Luxuriously soft cashmere blend sweater with a relaxed fit. Perfect layering piece for cooler weather.',
    price: 2999, originalPrice: 5499,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500',
    category: 'Women', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Cream', 'Grey', 'Burgundy'],
    stock: 45, rating: 4.8, numReviews: 156, featured: true,
  },
  {
    name: 'Kids Rainbow Hoodie',
    description: 'Fun and colorful rainbow stripe hoodie for kids. Made from soft organic cotton with a cozy fleece lining.',
    price: 899, originalPrice: 1499,
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500',
    category: 'Kids', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'], colors: ['Rainbow', 'Blue', 'Pink'],
    stock: 60, rating: 4.4, numReviews: 72, featured: true,
  },
  {
    name: 'Silk Blouse with Bow',
    description: 'Elegant silk blouse featuring a delicate bow neckline. Transitions seamlessly from office to evening wear.',
    price: 3499, originalPrice: 5999,
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500',
    category: 'Women', sizes: ['XS', 'S', 'M', 'L'], colors: ['Ivory', 'Black', 'Blush'],
    stock: 35, rating: 4.5, numReviews: 64, featured: true,
  },
  {
    name: 'Premium Leather Belt',
    description: 'Handcrafted genuine leather belt with brushed metal buckle. A versatile accessory for any wardrobe.',
    price: 799, originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Accessories', sizes: ['S', 'M', 'L'], colors: ['Brown', 'Black', 'Tan'],
    stock: 100, rating: 4.2, numReviews: 45, featured: true,
  },
  {
    name: 'Tailored Wool Blazer',
    description: 'Impeccably tailored wool blend blazer. Features a modern slim cut with notch lapels and two-button closure.',
    price: 6999, originalPrice: 11999,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500',
    category: 'Men', sizes: ['S', 'M', 'L', 'XL'], colors: ['Navy', 'Charcoal', 'Black'],
    stock: 25, rating: 4.7, numReviews: 112, featured: false,
  },
  {
    name: 'Yoga Leggings High Waist',
    description: 'High-performance yoga leggings with moisture-wicking fabric. Four-way stretch for maximum flexibility.',
    price: 1799, originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500',
    category: 'Women', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Black', 'Navy', 'Olive'],
    stock: 80, rating: 4.6, numReviews: 189, featured: false,
  },
  {
    name: 'Kids Denim Overalls',
    description: 'Adorable denim overalls for little ones. Durable construction with adjustable straps and multiple pockets.',
    price: 1299, originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1543854589-fdd4d3a0d181?w=500',
    category: 'Kids', sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'], colors: ['Blue Denim', 'Light Wash'],
    stock: 55, rating: 4.3, numReviews: 38, featured: false,
  },
  {
    name: 'Oversized Sunglasses',
    description: 'Trendy oversized sunglasses with UV400 protection. Lightweight acetate frame for all-day comfort.',
    price: 599, originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
    category: 'Accessories', sizes: ['One Size'], colors: ['Black', 'Tortoise', 'Pink'],
    stock: 120, rating: 4.1, numReviews: 67, featured: false,
  },
  {
    name: 'Linen Summer Shorts',
    description: 'Breathable linen shorts perfect for warm weather. Features an elastic waistband with drawstring for comfort.',
    price: 1199, originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500',
    category: 'Men', sizes: ['S', 'M', 'L', 'XL'], colors: ['Beige', 'Navy', 'Olive'],
    stock: 65, rating: 4.4, numReviews: 53, featured: false,
  },
  {
    name: 'Pleated Midi Skirt',
    description: 'Elegant pleated midi skirt in flowing chiffon. A versatile piece that pairs beautifully with any top.',
    price: 1999, originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500',
    category: 'Women', sizes: ['XS', 'S', 'M', 'L'], colors: ['Blush', 'Black', 'Sage'],
    stock: 40, rating: 4.5, numReviews: 91, featured: false,
  },
  {
    name: 'Canvas Tote Bag',
    description: 'Spacious canvas tote bag with leather handles. Perfect for shopping, beach trips, or everyday use.',
    price: 699, originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500',
    category: 'Accessories', sizes: ['One Size'], colors: ['Natural', 'Black', 'Navy'],
    stock: 90, rating: 4.3, numReviews: 78, featured: false,
  },
  {
    name: 'Kids Graphic T-Shirt Pack',
    description: 'Set of 3 fun graphic t-shirts for kids. Made from 100% organic cotton with vibrant, wash-resistant prints.',
    price: 799, originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500',
    category: 'Kids', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'], colors: ['Multi'],
    stock: 70, rating: 4.6, numReviews: 54, featured: false,
  },
];

const seedDB = async () => {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Database seeded with', products.length, 'products (INR prices)');
  process.exit(0);
};

seedDB();
