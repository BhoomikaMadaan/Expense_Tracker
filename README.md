
# Expense Tracker

## Overview
Expense Tracker built with Node.js, Express, MongoDB, and JWT authentication.

## Setup
```bash
npm install
```

Create `.env` file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_jwt_secret_key
```

## Run
```bash
npm run dev
```

## API Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/expenses` - Get user expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

## Frontend Pages
- `index.html` - Welcome page
- `register.html` - User registration
- `login.html` - User login
- `dashboard.html` - Expense management
