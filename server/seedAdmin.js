const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const connectDB = require('./config/db');

const createAdmin = async () => {
  await connectDB();
  const existing = await User.findOne({ email: 'admin@shopstyle.com' });
  if (existing) {
    console.log('Admin user already exists');
  } else {
    await User.create({
      name: 'Admin',
      email: 'admin@shopstyle.com',
      password: 'admin123',
      isAdmin: true,
    });
    console.log('Admin user created: admin@shopstyle.com / admin123');
  }
  process.exit(0);
};

createAdmin();
