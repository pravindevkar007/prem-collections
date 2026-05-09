const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const connectDB = require('./config/db');

const createAdmin = async () => {
  await connectDB();
  const existing = await User.findOne({ email: 'admin@premcollections.com' });
  if (existing) {
    console.log('Admin user already exists');
  } else {
    await User.create({
      name: 'Prem Collections',
      email: 'admin@premcollections.com',
      password: 'admin123',
      isAdmin: true,
    });
    console.log('Admin user created: admin@premcollections.com / admin123');
  }
  process.exit(0);
};

createAdmin();
