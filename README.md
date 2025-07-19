
# 🛡️ Auth Starter Kit — Node.js + Express + TypeScript + MongoDB

A complete, production-ready authentication starter built using **Node.js**, **Express.js**, **TypeScript**, and **MongoDB** — designed for developers who **constantly work on new projects and are tired of rewriting auth logic every time**.

> ✅ This project exists so you never have to waste time writing authentication boilerplate again. Plug it in, and start building what matters.

---

## 🚀 Features

- 🔐 JWT Authentication (Access + Refresh tokens)
- 📧 Email Verification & Reset Password
- ☁️ Google OAuth 2.0 Login
- 🖼️ Profile CRUD with Avatar Upload
- ✅ Request Validation Middleware Using ZOD
- 🧪 TypeScript-first Codebase
- 🌱 MongoDB via Mongoose
- 📄 Auto-generated Swagger API Docs
- 🔧 Simple `.env.development`-based Config System


## 🧑‍💻 Getting Started

1. **Clone**

```bash
git clone https://github.com/your-username/auth-starter-kit.git
cd auth-starter-kit
````

2. **Install**

```bash
npm install
# or
yarn
```

3. **Environment Config**

Create a `.env.development` file:

```env
MONGODB_URI=your_mongo_connection_string
PORT=5000
BASE_PATH=/api/v1
NODE_ENV=development

SESSION_SECRET=your_random_session_secret
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_EXPIRES_IN=1h

EMAIL_HOST=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
```

4. **Run**

```bash
npm run dev         # Development
npm run build && npm run start   # Production
```

---

## 📌 API Endpoints

### 🔐 Authentication

| Method | Endpoint                     | Description                   |
| ------ | ---------------------------- | ----------------------------- |
| POST   | `/register`                  | Register a new user           |
| POST   | `/login`                     | Login with email and password |
| GET    | `/verify-email/:token`       | Verify email using token      |
| POST   | `/resend-email-verification` | Resend email verification     |
| POST   | `/forgot-password`           | Send password reset link      |
| POST   | `/reset-password`            | Reset password using token    |
| POST   | `/refresh-token`             | Refresh access token          |
| POST   | `/logout`                    | Logout the current session    |

### ☁️ Google OAuth

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| GET    | `/google`          | Google login          |
| GET    | `/google/callback` | Google OAuth callback |

### 👤 Profile Management

| Method | Endpoint   | Description                      |
| ------ | ---------- | -------------------------------- |
| POST   | `/profile` | Create profile (optional avatar) |
| GET    | `/profile` | Get logged-in user's profile     |
| PATCH  | `/profile` | Update profile & avatar          |
| DELETE | `/profile` | Delete user profile              |

> Avatar uploads handled via `multipart/form-data` (`avatar` field).

---

## 📄 API Docs

Available at:
👉 **[http://localhost:3000/docs](http://localhost:3000/docs)**
Powered by **Swagger UI**

---

## 💡 Why This Exists

As developers, we often start new projects with the same repetitive need: **authentication**. Writing it over and over wastes valuable time. This project provides a **reusable, plug-and-play auth template** so you can skip the boring stuff and focus on your product.

