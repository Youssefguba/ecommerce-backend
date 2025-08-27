# E-commerce Backend API

A full-featured e-commerce backend API built with Node.js, Express, PostgreSQL, and Prisma. This API provides comprehensive functionality for user authentication, product management, shopping cart operations, and user profiles.

## 🚀 Features

- **User Authentication**: JWT-based auth with register/login/logout
- **Product Management**: CRUD operations with search and filtering
- **Shopping Cart**: Add/remove items, quantity management
- **User Profiles**: Profile management and password updates
- **Categories**: Product categorization system
- **Security**: Rate limiting, CORS, input validation, password hashing
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Comprehensive input validation and error handling

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone and Install

```bash
# Clone the repository (if using git)
git clone <your-repo-url>
cd ecommerce_BE

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRE="24h"

# Server
PORT=3000
NODE_ENV="development"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

**Important**: Replace the database credentials and JWT secret with your own values!

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 4. Start the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 📖 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "zipCode": "10001"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <jwt_token>
```

### Product Endpoints

#### Get All Products
```http
GET /api/products
# Query parameters:
# ?page=1&limit=10&category=1&search=iphone&minPrice=100&maxPrice=1000&sortBy=price&sortOrder=asc
```

#### Get Single Product
```http
GET /api/products/:id
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "name": "iPhone 15",
  "description": "Latest iPhone model",
  "price": 999.99,
  "sku": "IPHONE15",
  "stock": 50,
  "categoryId": 1,
  "imageUrl": "https://example.com/image.jpg",
  "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
}
```

#### Get All Categories
```http
GET /api/products/categories/all
```

### Cart Endpoints

#### Get User Cart
```http
GET /api/cart
Authorization: Bearer <jwt_token>
```

#### Add Item to Cart
```http
POST /api/cart/items
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /api/cart/items/:itemId
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove Item from Cart
```http
DELETE /api/cart/items/:itemId
Authorization: Bearer <jwt_token>
```

#### Clear Cart
```http
DELETE /api/cart
Authorization: Bearer <jwt_token>
```

### User Profile Endpoints

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <jwt_token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "address": "456 New St",
  "city": "Boston",
  "country": "USA",
  "zipCode": "02101"
}
```

#### Change Password
```http
PUT /api/users/password
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

## 🧪 Testing

You can test the API using the seeded data:

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`

**Test User:**
- Email: `test@example.com`
- Password: `test123`

## 📁 Project Structure

```
ecommerce_BE/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js           # Database seeding script
├── src/
│   ├── middleware/
│   │   ├── auth.js       # JWT authentication middleware
│   │   └── errorHandler.js # Global error handler
│   ├── routes/
│   │   ├── auth.js       # Authentication routes
│   │   ├── cart.js       # Shopping cart routes
│   │   ├── products.js   # Product routes
│   │   └── users.js      # User profile routes
│   ├── utils/
│   │   ├── generateToken.js # JWT token generation
│   │   └── validation.js    # Input validation rules
│   └── server.js         # Main application file
├── package.json
├── .gitignore
└── README.md
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive request validation
- **CORS**: Cross-origin resource sharing configuration
- **Security Headers**: Helmet.js for security headers
- **SQL Injection Protection**: Prisma ORM prevents SQL injection

## 🚀 Deployment

This API can be deployed to various platforms:

- **Railway**: Connect your GitHub repo and deploy automatically
- **Heroku**: Use the Heroku CLI or GitHub integration
- **DigitalOcean**: Deploy on App Platform or Droplets
- **AWS**: Deploy using Elastic Beanstalk or EC2
- **Vercel**: For serverless deployment (with some modifications)

Make sure to:
1. Set up your production PostgreSQL database
2. Configure environment variables on your hosting platform
3. Run database migrations: `npm run db:migrate`
4. Optionally seed data: `npm run db:seed`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the server logs for detailed error messages
2. Ensure your database is running and accessible
3. Verify your environment variables are correct
4. Make sure all dependencies are installed

For more help, check the API response format - all responses include a `success` field and descriptive error messages.

## 🎯 Next Steps

Consider adding these features for a production-ready application:

- Order management system
- Payment integration (Stripe, PayPal)
- Email notifications
- File upload for product images
- Admin dashboard
- API documentation with Swagger
- Comprehensive testing suite
- Logging with Winston
- Caching with Redis
- Search with Elasticsearch
