# Jobifies Backend API

A comprehensive job portal backend API built with Node.js, Express, TypeScript, PostgreSQL, and Redis.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with refresh tokens, role-based access control
- **Database**: PostgreSQL with connection pooling, Redis for caching and sessions
- **Security**: Helmet, CORS, rate limiting, input validation and sanitization
- **File Uploads**: Secure file handling with virus scanning capabilities
- **Email Service**: Transactional emails with templates
- **Payment Integration**: Stripe and Razorpay integration
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation
- **Logging**: Structured logging with Winston
- **Testing**: Unit and integration tests with Jest
- **Production Ready**: Optimized for deployment on Render.com

## 📋 Prerequisites

- Node.js (v18.0.0 or higher)
- PostgreSQL (v12 or higher)
- Redis (v6 or higher)
- npm (v8.0.0 or higher)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=jobifies_dev
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   # Redis
   REDIS_HOST=localhost
   REDIS_PORT=6379
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   
   # Email (optional for development)
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb jobifies_dev
   
   # Run migrations
   npm run migrate
   
   # Seed initial data
   npm run seed
   ```

## 🏃‍♂️ Running the Application

### Development
```bash
npm run dev
```
The server will start on http://localhost:5000 with hot reload enabled.

### Production Build
```bash
npm run build
npm start
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health

## 🗄️ Database

### Migrations
```bash
# Run all pending migrations
npm run migrate

# Check migration status
npm run migrate status

# Create new migration
npm run migrate create "migration_name"

# Rollback last migration (use with caution)
npm run migrate rollback
```

### Schema Overview

The database includes the following main entities:
- **Users**: Job seekers, recruiters, and admins
- **User Profiles**: Extended profile information
- **Companies**: Company information and verification
- **Jobs**: Job postings with detailed requirements
- **Applications**: Job applications with status tracking
- **Subscriptions**: Payment plans and subscriptions
- **Notifications**: User notifications system

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔐 Authentication

The API uses JWT tokens for authentication:

1. **Register**: `POST /api/v1/auth/register`
2. **Login**: `POST /api/v1/auth/login`
3. **Refresh Token**: `POST /api/v1/auth/refresh`
4. **Logout**: `POST /api/v1/auth/logout`

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh tokens
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/verify-email` - Verify email address
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile

### Jobs
- `GET /api/v1/jobs` - Search jobs with filters
- `POST /api/v1/jobs` - Create job posting
- `GET /api/v1/jobs/:id` - Get job details
- `PUT /api/v1/jobs/:id` - Update job posting
- `DELETE /api/v1/jobs/:id` - Delete job posting

### Companies
- `GET /api/v1/companies` - List companies
- `POST /api/v1/companies` - Create company
- `GET /api/v1/companies/:id` - Get company details

### Applications
- `GET /api/v1/applications` - Get user applications
- `POST /api/v1/applications` - Apply for job
- `GET /api/v1/applications/:id` - Get application details
- `PUT /api/v1/applications/:id` - Update application status

### File Uploads
- `POST /api/v1/uploads/resume` - Upload resume
- `POST /api/v1/uploads/profile-picture` - Upload profile picture
- `POST /api/v1/uploads/company-logo` - Upload company logo

### Admin (Admin/Super Admin only)
- `GET /api/v1/admin/users` - List all users
- `GET /api/v1/admin/stats` - Get system statistics
- `PUT /api/v1/admin/users/:id` - Update user status

## 🔒 Security Features

- **Helmet**: Security headers protection
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization
- **JWT Security**: Secure token handling with refresh tokens

## 📊 Logging

The application uses structured logging with Winston:
- **Development**: Console output with colors
- **Production**: File-based logging with rotation
- **Log Levels**: error, warn, info, debug

Log files are stored in the `logs/` directory with daily rotation.

## 🚀 Deployment

### Render.com Deployment

1. **Environment Variables**: Set in Render dashboard
   - `NODE_ENV=production`
   - `DATABASE_URL` (provided by Render PostgreSQL)
   - `REDIS_URL` (provided by Render Redis)
   - All other environment variables from `.env.example`

2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`

### Docker Deployment

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **Redis Connection Error**
   - Verify Redis server is running
   - Check Redis configuration

3. **Email Not Sending**
   - Verify SMTP credentials
   - Check email service configuration
   - Email service is optional for development

4. **Migration Errors**
   - Check database permissions
   - Verify migration files syntax
   - Check for conflicting migrations

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route handlers (to be implemented)
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models (to be implemented)
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript type definitions
│   └── database/        # Migrations and seeds
├── tests/               # Test files
├── logs/                # Log files (created at runtime)
├── uploads/             # File uploads (created at runtime)
└── dist/                # Compiled TypeScript (created at build)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.