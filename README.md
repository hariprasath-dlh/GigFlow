# GigFlow – Mini Freelance Marketplace Platform

GigFlow is a full-stack freelance marketplace web application where clients can post jobs (gigs) and freelancers can submit bids. The platform focuses on secure authentication, correct hiring logic, real-time notifications, and email alerts, closely simulating real-world freelance systems.

---

## 🚀 Features

### 🔐 Authentication
- Email & password authentication
- JWT-based authentication with HttpOnly cookies
- Secure session handling

### 📋 Gig Management
- Clients can create and manage gigs
- Public listing of open gigs
- Search gigs by title

### 💼 Bidding System
- Freelancers can submit bids with message and price
- Clients can view all bids for their gigs
- Authorization enforced (owners only)

### ✅ Atomic Hiring Logic (Core Feature)
- Only one freelancer can be hired per gig
- Gig status changes from **open → assigned**
- Selected bid marked as **hired**
- All other bids automatically **rejected**
- Prevents race conditions and multiple hires

### 🔔 Real-Time Notifications
- Instant in-app notifications using Socket.IO when a freelancer is hired

### 📧 Email Notifications
- Automated hire confirmation emails
- Implemented using Nodemailer with Gmail SMTP

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- React Router
- Context API
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Socket.IO
- Nodemailer

---

## 📂 Project Structure

## 📁 Project Structure

```text
gigflow/
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   └── package.json
│
└── README.md
```


---

## ⚙️ Setup Instructions

### Backend Setup
```bash
  cd backend
  npm install
  npm run dev

---

Frontend Setup:
  cd frontend
  npm install
  npm run dev

🔑 Environment Variables:

Create a .env file in the backend directory using the following template:
  PORT=5001
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  EMAIL_USER=your_gmail_address
  EMAIL_PASS=your_gmail_app_password
(Note: Use a Gmail App Password, not your regular Gmail password.)

🔄 Application Flow
  1.User registers and logs in
  2.Client creates a gig
  3.Freelancer submits a bid
  4.Client reviews bids
  5.Client hires one freelancer
  6.Freelancer receives:
    *Real-time in-app notification
    *Email notification

