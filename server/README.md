# Prem Collections - Backend API

Backend API server for Prem Collections e-commerce platform

## 🚀 Live API
[API Base URL](https://prem-collections-server.onrender.com)

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Multer for file uploads
- CORS enabled

## 📦 Installation

```bash
npm install
npm start
```

## 🌱 Database Setup

```bash
# Seed products
npm run seed

# Create admin user
npm run seed-admin
```

## 🔐 Admin Credentials
- Email: admin@shopstyle.com
- Password: admin123

## 🌐 Deployment
This API is deployed on Render with automatic deployments from the main branch.

## 🔗 Frontend
Frontend Repository: [prem-collections-client](https://github.com/Pravindevkar007/prem-collections-client)

## 📋 API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product (Admin)
- PUT `/api/products/:id` - Update product (Admin)
- DELETE `/api/products/:id` - Delete product (Admin)

### Orders
- GET `/api/orders/my-orders` - Get user orders
- POST `/api/orders` - Create order
- GET `/api/orders/all` - Get all orders (Admin)
- PUT `/api/orders/:id/status` - Update order status (Admin)