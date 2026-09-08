# ClassFlow

> **Where learning and teaching work together.**

ClassFlow is a full-stack learning management workspace designed to connect students and administrators through a centralized platform for managing classes, assignments, submissions, grades, and user accounts.

The project was built to apply and demonstrate practical full-stack development concepts including authentication, authorization, REST APIs, database relationships, security, and responsive UI design.

---

## ✨ Features

### 🔐 Authentication & Security

* Email and password authentication
* Google Sign-In
* JWT-based authentication
* Access and refresh tokens
* HTTP-only cookies
* Refresh token hashing
* Password hashing
* Role-Based Access Control (RBAC)
* Protected API routes
* Password reset functionality
* Secure, expiring, single-use password reset tokens
* Password reset email delivery through SMTP
* Google OAuth account linking

### 👨‍💼 Admin Features

* Admin dashboard
* Create and manage classes
* Configure class schedules
* Set class capacity
* View enrolled students
* Bulk student removal
* Assignment management
* View student submissions
* Grade assignments
* Provide student feedback
* View reports and statistics

### 👨‍🎓 Student Features

* Student dashboard
* View enrolled classes
* View class assignments
* Submit assignments
* Attach files to submissions
* Update/resubmit assignments
* View grades
* View instructor feedback
* View profile information

### 👤 Profile Management

* View account information
* Edit profile information
* Change password
* Minimal read-only profile interface
* Confirmation prompts for account changes

### 📱 Responsive Design

ClassFlow is designed to work across:

* Desktop
* Tablet
* Mobile

The interface adapts navigation, layouts, forms, tables, and dashboard components for smaller screens.

---

## 🖼️ Screenshots

### Login

<img width="1907" height="904" alt="Login" src="https://github.com/user-attachments/assets/41b28e4c-7a85-46f9-a93e-e2b5a539083f" />




### Admin Dashboard

<img width="1907" height="894" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/9bc8a7c9-5543-44dc-8961-38621e0329d0" />




### Student Dashboard

<img width="1908" height="787" alt="Student Dashboad" src="https://github.com/user-attachments/assets/2f74cdb9-77b3-4308-ac30-edc0b48f942a" />




### Class Management

<img width="1907" height="896" alt="Admin Class Managment" src="https://github.com/user-attachments/assets/68ec93ba-7c73-4a1e-83cb-6654031334b1" />




### Assignment Management

<img width="1909" height="756" alt="Admin Assignment Management" src="https://github.com/user-attachments/assets/6dde8e53-7db3-4648-a670-9acebba70fff" />




### Assignment Submission & Grading

<img width="963" height="579" alt="Assignment Graded and Feedback" src="https://github.com/user-attachments/assets/891eb113-bd8e-4f17-ab26-04056fc32112" />




### Mobile Interface

<img width="261" height="542" alt="Admin Dashboard Mobile" src="https://github.com/user-attachments/assets/4d3b655b-7462-426c-baf3-a98f0502ef26" />

<img width="261" height="542" alt="Admin Classes Mobile" src="https://github.com/user-attachments/assets/c8ebd267-8365-402a-9bfd-1d681215f36d" />

<img width="261" height="542" alt="Admin Reports Mobile" src="https://github.com/user-attachments/assets/6c179f83-0349-40a5-bedc-0cd79c0f30f9" />


---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Tailwind CSS
* Axios
* Day.js
* Lucide React

### Backend

* Node.js
* Express.js
* REST API
* JWT
* Nodemailer
* Google OAuth / Google Identity Services
* Zod

### Database

* MySQL

### Development

* Git
* GitHub
* Postman

---

## 🏗️ Architecture

ClassFlow follows a client-server architecture:

```text
┌─────────────────────────────┐
│          Frontend           │
│                             │
│ React + Vite + Tailwind CSS │
└──────────────┬──────────────┘
               │
               │ HTTP / REST API
               ▼
┌─────────────────────────────┐
│           Backend           │
│                             │
│ Node.js + Express           │
│ Authentication              │
│ Authorization               │
│ Business Logic              │
└──────────────┬──────────────┘
               │
               │ SQL
               ▼
┌─────────────────────────────┐
│           MySQL             │
│                             │
│ Users                       │
│ Classes                     │
│ Enrollments                 │
│ Assignments                 │
│ Submissions                 │
│ OAuth Accounts              │
│ Password Reset Tokens       │
└─────────────────────────────┘
```

---

## 🔑 Authentication Flow

ClassFlow supports both traditional authentication and Google Sign-In.

### Email & Password

```text
User
 ↓
Login
 ↓
Validate credentials
 ↓
Verify password hash
 ↓
Generate access + refresh tokens
 ↓
HTTP-only cookies
 ↓
Authenticated ClassFlow session
```

### Google Sign-In

```text
User
 ↓
Google Sign-In
 ↓
Google Identity Services
 ↓
Google ID Token
 ↓
Backend verifies token
 ↓
Find/Create OAuth Account
 ↓
Find/Create ClassFlow User
 ↓
Generate ClassFlow access + refresh tokens
 ↓
HTTP-only cookies
```

Google accounts are stored separately from user authentication data using the `oauth_accounts` table.

---

## 🔒 Password Reset Flow

ClassFlow implements a secure password recovery workflow.

```text
Forgot Password
      ↓
Generate cryptographically secure token
      ↓
Hash token
      ↓
Store hashed token + expiration
      ↓
Send reset link through SMTP
      ↓
User opens reset link
      ↓
Validate token
      ↓
Set new password
      ↓
Invalidate reset token
```

Password reset tokens are:

* Cryptographically random
* Hashed before database storage
* Time-limited
* Single-use

The application also avoids revealing whether an email address is registered.

---

## 🗄️ Database

The main database entities include:

```text
users
 │
 ├────────────── oauth_accounts
 │
 ├────────────── password_reset_tokens
 │
 └────────────── enrollments
                       │
                       ▼
                     classes
                       │
                       ▼
                  assignments
                       │
                       ▼
                  submissions
```

### Main Tables

| Table                   | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `users`                 | Stores Student and Admin accounts                |
| `oauth_accounts`        | Stores external authentication provider accounts |
| `password_reset_tokens` | Stores hashed password reset tokens              |
| `classes`               | Stores class information and schedules           |
| `enrollments`           | Connects students to classes                     |
| `assignments`           | Stores class assignments                         |
| `submissions`           | Stores student assignment submissions and grades |

---

## 📁 Project Structure

### Backend

```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── utils/
│   ├── app.js
│   └── server.js
└── package.json
```

### Frontend

```text
frontend/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── layout/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* MySQL
* Git

---

### 1. Clone the repository

```bash
git clone https://github.com/karlculi44/ClassFlow.git
cd ClassFlow
```

---

### 2. Install dependencies

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd ../backend
npm install
```

---

### 3. Configure MySQL

Create a MySQL database:

```sql
CREATE DATABASE class_flow;
```

Import the database schema provided in the project.
[class_flow.sql](https://github.com/user-attachments/files/31931660/class_flow.sql)


---

### 4. Configure environment variables

Create a `.env` file inside the backend directory.

```env
PORT=3000

DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=classflow

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

GOOGLE_CLIENT_ID=your_google_client_id

FRONTEND_URL=http://localhost:5173

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

MAIL_FROM=ClassFlow <your_email@gmail.com>
```

Create a `.env` file inside the frontend directory.

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

> **Never commit your `.env` file or any secret credentials to GitHub.**

---

### 5. Start the backend

```bash
cd backend
npm run dev
```

The backend will run on:

```text
http://localhost:3000
```

---

### 6. Start the frontend

In another terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## 🔑 Environment Variables

| Variable               | Description                        |
| ---------------------- | ---------------------------------- |
| `PORT`                 | Backend server port                |
| `DB_HOST`              | MySQL host                         |
| `DB_USER`              | MySQL username                     |
| `DB_PASSWORD`          | MySQL password                     |
| `DB_NAME`              | MySQL database name                |
| `ACCESS_TOKEN_SECRET`  | Secret used to sign access tokens  |
| `REFRESH_TOKEN_SECRET` | Secret used to sign refresh tokens |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID             |
| `FRONTEND_URL`         | Frontend application URL           |
| `SMTP_HOST`            | SMTP server                        |
| `SMTP_PORT`            | SMTP port                          |
| `SMTP_SECURE`          | SMTP TLS configuration             |
| `SMTP_USER`            | SMTP account                       |
| `SMTP_PASSWORD`        | SMTP/App password                  |
| `MAIL_FROM`            | Password reset email sender        |
| `VITE_GOOGLE_CLIENT_ID`| Google OAuth Client Id             |


---

## 🛡️ Security Considerations

ClassFlow implements several security practices:

* Passwords are never stored in plaintext
* Refresh tokens are hashed before database storage
* Authentication tokens are stored in HTTP-only cookies
* Protected routes require authentication
* Role-based authorization prevents unauthorized access
* Password reset tokens are hashed
* Password reset tokens expire
* Password reset tokens can only be used once
* Generic password-reset responses help prevent account enumeration
* Sensitive configuration is stored in environment variables

---

## 📌 Project Status

**ClassFlow v1.0.0 — Complete**

The first version focuses on the core learning and teaching workflow, authentication, authorization, class management, assignments, submissions, grading, and account management.

---

## 🔮 Future Improvements

Potential future improvements include:

* Instructor-specific roles and permissions
* Real-time notifications
* Email notifications for assignments and grades
* Google Calendar integration
* File storage using cloud object storage
* Advanced analytics
* Search and filtering improvements
* Automated end-to-end testing
* Production deployment
* Progressive Web App (PWA) support

---

## 👨‍💻 Author

**Karl Culi**

Interested in **Software Engineering and Full-Stack Development**.

---

## 📄 License

This project is intended as a portfolio and learning project.
