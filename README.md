# 🛒 MERN E-Commerce — Full Stack Application

A complete, production-ready e-commerce platform built with MongoDB, Express, React (Vite), and Node.js.

---

## 📁 Project Structure

```
mern-ecommerce/
├── backend/               # Node.js + Express API
│   ├── controllers/       # Route handlers
│   ├── middleware/        # JWT auth middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── uploads/           # Uploaded product images
│   ├── utils/             # Mailer, seed utilities
│   ├── server.js          # Entry point
│   └── .env.example
├── frontend/              # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React contexts (cart, auth, settings)
│   │   ├── pages/         # Page components
│   │   │   └── admin/     # Admin panel pages
│   │   └── utils/         # API client
│   └── .env.example
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Gmail account with App Password (for email notifications)

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/mern-ecommerce
JWT_SECRET=your_super_secret_key_minimum_32_chars
EMAIL_USER=your.gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Configure Frontend Environment

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Run Development Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Visit: `http://localhost:5173`
Admin panel: `http://localhost:5173/admin`
Default credentials: `admin` / `admin123`

---

## 📧 Gmail Setup (Email Notifications)

To enable order email notifications:

1. Go to your Google Account → Security
2. Enable **2-Step Verification**
3. Search for **App Passwords**
4. Generate a new App Password for "Mail"
5. Use that 16-character password as `EMAIL_PASS`

> ⚠️ **Important:** Set `notificationEmail` in Admin → Settings to receive order notifications.

---

## 🔑 Admin Panel Features

URL: `/admin` | Login: `/admin/login`

| Section | Features |
|---------|----------|
| **Dashboard** | Total orders, revenue, products, recent orders, status breakdown |
| **Products** | List, search, add/edit/delete, image upload, popular flag |
| **Orders** | View all, filter by status, search, update status, detail panel |
| **Settings** | Store name, contact info, WhatsApp, notification email, currency, social links |
| **Security** | Change admin password |

---

## 🛍️ Customer Features

- **Homepage** — Hero banner, categories filter, popular products, new arrivals
- **Catalogue/Search** — Full text search, category filter, sort options, pagination
- **Product Page** — Image gallery, quantity selector, add to cart, WhatsApp order button
- **Cart** — Quantity management, remove items, persistent across sessions
- **Checkout** — Simple form (name, phone, address, optional email + notes)
- **Order Success** — Confirmation with order number, WhatsApp follow-up link

---

## 🚀 Deployment

### Option A: Render (Backend) + Vercel (Frontend)

#### Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo, select `backend/` as root
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add all environment variables from `.env.example`
7. Set `FRONTEND_URL` to your Vercel URL

#### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-render-app.onrender.com`
5. Deploy!

> After deployment, update `FRONTEND_URL` in Render to your Vercel URL.

### Option B: Railway (Full Stack)

1. Deploy backend to [railway.app](https://railway.app)
2. Add MongoDB via Railway plugin or Atlas
3. Deploy frontend to Vercel as above

---

## 🔌 API Reference

### Public Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/products` | List products (search, filter, paginate) |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/products/categories` | Get all categories |
| GET | `/api/settings` | Get store settings |
| POST | `/api/orders` | Create new order |

### Admin Endpoints (JWT Required)

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/profile` | Get admin profile |
| PUT | `/api/admin/change-password` | Change password |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/orders` | List orders |
| GET | `/api/orders/stats` | Dashboard stats |
| PUT | `/api/orders/:id/status` | Update order status |
| DELETE | `/api/orders/:id` | Delete order |
| PUT | `/api/settings` | Update store settings |
| POST | `/api/upload` | Upload single image |
| POST | `/api/upload/multiple` | Upload multiple images |

---

## 🗄️ Data Models

### Product
```
name, description, price, originalPrice, category, images[], stock,
isPopular, isFeatured, rating, reviewCount, tags[], sku
```

### Order
```
orderNumber (auto), customer{name, phone, email, address},
items[{product, name, price, quantity, image}],
totalAmount, status, notes
```

### Settings
```
storeName, storeDescription, contactPhone, contactEmail, address,
whatsappNumber, notificationEmail, currency, currencySymbol,
freeShippingThreshold, socialLinks{facebook, instagram, twitter}
```

---

## 🔒 Security Notes

- JWT tokens expire after 7 days
- Passwords hashed with bcrypt (12 rounds)
- CORS restricted to `FRONTEND_URL`
- Image uploads restricted to images only, max 5MB
- Change default admin password immediately after first login!

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Routing | React Router v6 |
| State | Context API + useReducer |
| HTTP Client | Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| File Upload | Multer |
| Email | Nodemailer + Gmail |
| Notifications | react-hot-toast |
| Icons | Lucide React |
