# Prem Collections - Shopping Application

A full-stack e-commerce application built with React and Node.js.

## Features

- User authentication and authorization
- Product catalog with categories
- Shopping cart functionality
- Order management
- Admin dashboard
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, React Router, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB, JWT
- **Deployment**: Netlify (Frontend), MongoDB Atlas (Database)

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Shopping_Application
   ```

2. **Install dependencies**
   ```bash
   # Server dependencies
   cd server
   npm install
   
   # Client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   **Server** (`server/.env`):
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3002
   ```
   
   **Client** (`client/.env`):
   ```env
   # For local development
   REACT_APP_API_URL=http://localhost:3002/api
   
   # For production with Netlify Functions
   # REACT_APP_API_URL=/.netlify/functions/api
   ```

4. **Create Admin User**
   ```bash
   cd server
   node seedAdmin.js
   ```

5. **Start the Application**
   ```bash
   # Terminal 1 - Start server
   cd server
   npm start
   
   # Terminal 2 - Start client
   cd client
   npm start
   ```

## Access Points

- **Client**: http://localhost:3000
- **Server API**: http://localhost:3002
- **Admin Login**: admin@premcollections.com / admin123

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/products` - Get products
- `POST /api/orders` - Create order

## Project Structure

```
Shopping_Application/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   └── routes/         # Route configuration
│   └── public/             # Static assets
├── server/                 # Express backend
│   ├── config/             # Database configuration
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── middleware/         # Custom middleware
└── README.md
```

## Deployment

### Development
- Uses local Express server on port 3002
- Client connects to `http://localhost:3002/api`

### Production
- Frontend deployed to Netlify
- Backend uses Netlify Functions
- Client connects to `/.netlify/functions/api`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.