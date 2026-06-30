# 🚀 Multi-Tenant Feature Flagging System

A robust, full-stack application designed to manage and evaluate feature flags for multiple organizations independently. This system enables developers to toggle features on/off in real-time, ensuring safe deployments and testing.

## 🌟 Key Capabilities

* **Multi-Tenancy:** Strict data isolation—each organization only manages and accesses its own unique set of feature flags.
* **Role-Based Access Control (RBAC):** Distinct interfaces for Super Admins (system oversight), Org Admins (feature management), and End Users (feature evaluation).
* **Real-time CRUD:** Create, Read, Update, and Delete feature flags through a clean, responsive Admin Dashboard.
* **Secure API:** Stateless authentication using JWTs to protect administrative routes, while maintaining a public-facing evaluation API for end-users.

## 🛠 Tech Stack

* **Frontend:** Next.js, Tailwind CSS, Axios.
* **Backend:** Node.js, Express, JSON Web Tokens (JWT), Bcrypt.js.
* **Database:** MongoDB, Mongoose.

## 📋 Project Structure

```text
├── backend/
│   ├── controllers/   # Logic for Admin, Super Admin, and Public Evaluation
│   ├── middlewares/   # Authentication and Authorization guards
│   ├── models/        # Mongoose schemas (User, Organization, Flag)
│   ├── routes/        # API endpoint definitions
│   └── server.js      # Main Express application entry point
├── frontend/
│   ├── src/app/       # Next.js App Router (Admin & End User portals)
│   └── components/    # Reusable UI components

```

## ⚙️ Getting Started

### 1. Prerequisites

* [Node.js](https://nodejs.org/) (v24+)
* [MongoDB](https://www.mongodb.com/)

### 2. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_key
SUPER_ADMIN_EMAIL=superadmin@example.com
SUPER_ADMIN_PASSWORD=your_secure_password

```

Create a `.env` file in the `frontend/` directory:

```env
PORT=3000

SUPER_ADMIN_EMAIL=superadmin@example.com
SUPER_ADMIN_PASSWORD=your_secure_password

```

### 3. Installation

```bash
# Backend setup
cd backend
npm install
npm run dev

# Frontend setup
cd ../frontend
npm install
npm run dev

```

## 🔐 Security Features

* **Data Blindness:** All database operations are filtered by `organizationId`, preventing cross-tenant data leakage.
* **Password Hashing:** Utilizing `bcryptjs` to ensure secure credential storage.
* **CORS Protection:** Configured to strictly allow requests only from your authorized frontend origin.

## 👤 Author

**Sivakumar** | *Computer Science and Engineering Student*

---

*This project was developed to demonstrate expertise in modern web development, full-stack architecture, and secure software engineering practices.*
