const mongoose = require('mongoose');
const User = require('../../../server/models/User');
const connectDB = require('../../../server/config/db');

exports.handler = async (event, context) => {
  try {
    await connectDB();
    
    const existing = await User.findOne({ email: 'admin@premcollections.com' });
    if (existing) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Admin user already exists' })
      };
    }
    
    await User.create({
      name: 'Prem Collections',
      email: 'admin@premcollections.com',
      password: 'admin123',
      isAdmin: true,
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Admin user created successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};