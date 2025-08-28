# Jobifies - Job Portal Platform

A comprehensive job portal platform built with modern web technologies.

## 🚀 One-Click Deployment

[![Deploy Backend to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Technifies/jobifies-v5)

[![Deploy Frontend to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Technifies/jobifies-v5&stack=react)

## 🚀 Project Overview

Jobifies is a full-featured job portal that connects job seekers with employers and recruiters. It includes advanced features like AI-powered matching, resume parsing, and comprehensive analytics.

## 🏗️ Architecture

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS (Deployed on Netlify)
- **Backend**: Node.js + Express + PostgreSQL + Redis (Deployed on Render)
- **Search**: Elasticsearch
- **AI/ML**: OpenAI integration + Custom NLP models
- **Payments**: Stripe + Razorpay + PayPal

## 📁 Project Structure

```
jobifies/
├── frontend/          # Next.js frontend application
├── backend/           # Node.js backend API
├── shared/            # Shared types and utilities
├── docs/              # Project documentation
├── .github/           # GitHub workflows and templates
└── scripts/           # Build and deployment scripts
```

## 🎯 Key Features

### Core Modules
1. **User Management** - Job seekers, recruiters, and admin users
2. **Job Posting & Management** - Comprehensive job posting system
3. **Resume Database & Search** - Advanced candidate search
4. **Job Search & Discovery** - AI-powered job recommendations
5. **AI-Powered Modules** - Resume parsing and matching
6. **Subscriptions & Monetization** - Multi-tier pricing
7. **Notifications & Alerts** - Real-time notifications
8. **Analytics & Insights** - Comprehensive analytics
9. **Admin Control Panel** - Platform management
10. **ATS & Third-Party Integrations** - Enterprise integrations
11. **SEO & Mobile Optimization** - Performance optimized
12. **Security & Compliance** - GDPR/CCPA compliant

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 6+
- Elasticsearch 8+

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jobifies
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend && npm install
   
   # Install backend dependencies
   cd ../backend && npm install
   ```

3. **Environment setup**
   ```bash
   # Copy environment files
   cp frontend/.env.example frontend/.env.local
   cp backend/.env.example backend/.env
   ```

4. **Database setup**
   ```bash
   # Run database migrations
   cd backend && npm run migrate
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Start backend
   cd backend && npm run dev
   
   # Terminal 2: Start frontend
   cd frontend && npm run dev
   ```

## 📖 Documentation

- [Technical Architecture](./TECHNICAL_ARCHITECTURE.md)
- [Design System](./DESIGN_SYSTEM_FOUNDATION.md)
- [Brand Guidelines](./BRAND_IDENTITY_GUIDELINES.md)
- [Component Library](./COMPONENT_LIBRARY.md)
- [API Documentation](./docs/api.md)

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run frontend tests
cd frontend && npm run test

# Run backend tests
cd backend && npm run test
```

## 🚀 Deployment

### Frontend (Netlify)
- Automatically deployed from `main` branch
- Build command: `npm run build`
- Publish directory: `frontend/out`

### Backend (Render)
- Automatically deployed from `main` branch
- Build command: `npm run build`
- Start command: `npm start`

## 📊 Project Status

- **Phase 1**: Foundation & Core Setup (Weeks 1-3) ✅
- **Phase 2**: User Management & Profiles (Weeks 4-6) 🏗️
- **Phase 3**: Job Management System (Weeks 7-9) 📋
- **Phase 4**: Advanced Features & AI (Weeks 10-12) 📋
- **Phase 5**: Monetization & Subscriptions (Weeks 13-14) 📋
- **Phase 6**: Optimization & Launch (Weeks 15-16) 📋

## 👥 Team

- Project Manager
- Business Analyst
- Tech Lead Architect
- UX/UI Designer
- Frontend Developer
- Backend API Developer
- DevOps Infrastructure Specialist
- QA Tester

## 📄 License

This project is proprietary and confidential.

## 🤝 Contributing

Please read our contributing guidelines and code of conduct before submitting pull requests.

## 📞 Support

For support and questions, please contact the development team.