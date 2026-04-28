# Loan Management System (LMS)

A full-stack lending platform built with Next.js, Express.js, and MongoDB.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt

## Project Structure
lms/
├── frontend/
└── backend/

## Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm

## Setup

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder: <br>
PORT=5000 <br>
MONGO_URI=mongodb://localhost:27017/lms <br>
JWT_SECRET=your_secret_key_here <br>

Create the uploads folder:

```bash
mkdir uploads
```

Seed the database with role accounts:

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in the frontend folder: <br>
NEXT_PUBLIC_API_URL=http://localhost:5000/api

Start the app:

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lms.com | Password@123 |
| Sales | sales@lms.com | Password@123 |
| Sanction | sanction@lms.com | Password@123 |
| Disbursement | disbursement@lms.com | Password@123 |
| Collection | collection@lms.com | Password@123 |

Borrowers register themselves via the Sign Up page.

## Features

### Borrower Portal
- Sign up and login
- Personal details form with BRE eligibility check
- Salary slip upload (PDF/JPG/PNG, max 5MB)
- Loan configuration with live interest calculator
- Loan status tracker

### Operations Dashboard
- **Sales** — View leads and all registered borrowers
- **Sanction** — Approve or reject loan applications
- **Disbursement** — Mark sanctioned loans as disbursed
- **Collection** — Record payments and auto-close fully repaid loans
- **Admin** — Access to all four modules

### Business Rules (BRE)
- Age must be between 23 and 50
- Monthly salary must be at least ₹25,000
- PAN must match valid format (e.g. ABCDE1234F)
- Employment mode must not be unemployed

### Loan Calculation
Simple Interest = (P × R × T) / (365 × 100)
Total Repayment = Principal + Simple Interest
Interest Rate   = 12% per annum

## API Endpoints

| Method | Route | Access |
|--------|-------|--------|
| POST | /api/auth/signup | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Borrower |
| POST | /api/borrower/personal-details | Borrower |
| POST | /api/borrower/upload-salary | Borrower |
| POST | /api/borrower/apply | Borrower |
| GET | /api/borrower/loan-status | Borrower |
| GET | /api/sales/leads | Sales, Admin |
| GET | /api/sales/borrowers | Sales, Admin |
| GET | /api/sanction/loans | Sanction, Admin |
| PUT | /api/sanction/loans/:id/sanction | Sanction, Admin |
| PUT | /api/sanction/loans/:id/reject | Sanction, Admin |
| GET | /api/disbursement/loans | Disbursement, Admin |
| PUT | /api/disbursement/loans/:id/disburse | Disbursement, Admin |
| GET | /api/collection/loans | Collection, Admin |
| POST | /api/collection/loans/:id/payment | Collection, Admin |
| GET | /api/collection/loans/:id/payments | Collection, Admin |

##  Deployment

### Frontend
 **Vercel Platform**


### Backend
 **Render Platform**

---

##  Author

| Detail | Info |
|------|------|
| Name | **Abhishek Yadav** |
| Degree | B.Tech CSE (AI) |
| Institute | IET Lucknow |
| Role | Full Stack Developer |
| Competitive Programming | CodeChef `3-Star Coder`, Codeforces `Specialist` |
| LinkedIn | https://www.linkedin.com/in/abhishek-yadav-637136257/ |