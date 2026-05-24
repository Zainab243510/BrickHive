# 🏠 BRICKHIVE

A full-stack **Property Listing Web Application** built with the **MERN stack**. BRICKHIVE lets users list, browse, and purchase properties with Stripe-powered checkout, Cloudinary image hosting, and Google sign-in via Firebase Auth.

**🌐 Live Demo:** [https://brick-hive.vercel.app](https://brick-hive.vercel.app)

---

## 🚀 Features

### 🔐 Authentication
* JWT-based email/password auth
* Google sign-in via Firebase Auth
* Protected user-specific routes

### 🏡 Property Management
* Create, update, delete, and view property listings
* Image uploads via Cloudinary
* Mark and manage favorite listings

### 🔍 Search & Discovery
* Filter by price range, amenities, sale/rent type, and location
* Interactive charts for top listings (Chart.js / Recharts)

### 💳 Payments
* Stripe Checkout integration (test mode)
* Webhook-driven order confirmation

### ⚡ UI
* React 19 + Tailwind CSS v4
* Redux Toolkit for state management
* Responsive across mobile and desktop

---

## 🛠️ Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS v4, Redux Toolkit, Axios, Firebase Auth, Chart.js, Recharts, Swiper

**Backend:** Node.js, Express 5, MongoDB (Mongoose)

**Services:** Stripe, Cloudinary, MongoDB Atlas

---

## 📁 Project Structure

```
BRICKHIVE/
├── api/
│   └── index.js          # Serverless entry point (Vercel)
├── server/               # Express app code
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── utils/
├── client/               # React + Vite frontend
│   ├── src/
│   └── package.json
├── vercel.json
└── package.json
```

---

## ⚙️ Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/Zainab243510/BrickHive.git
cd BrickHive
```

### 2. Install dependencies

```bash
# Backend (root)
npm install

# Frontend
cd client && npm install && cd ..
```

### 3. Environment variables

Create a `.env` in the project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=PKR

CLIENT_URL=http://localhost:5173
```

Create a `client/.env` for the frontend:

```env
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
```

### 4. Run the app

```bash
# Backend (http://localhost:3000)
npm run dev

# Frontend (http://localhost:5173) — in a second terminal
cd client && npm run dev
```

### 5. (Optional) Stripe webhook for local testing

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:

```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

Copy the `whsec_...` it prints into your `.env` as `STRIPE_WEBHOOK_SECRET`.

---

## 🚢 Deployment (Vercel)

BRICKHIVE is set up to deploy to Vercel as one static frontend + one serverless API function.

1. Push your repo to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. **Framework Preset:** Other (leave Build/Output commands blank — `vercel.json` handles them)
4. Add all the env vars from the **Local Setup** section under **Settings → Environment Variables** (including `VITE_FIREBASE_API_KEY`, which Vite inlines at build time)
5. Set `CLIENT_URL` to your Vercel domain (e.g. `https://your-app.vercel.app`)
6. **MongoDB Atlas → Network Access:** add `0.0.0.0/0` so Vercel's dynamic IPs can connect
7. **Stripe Dashboard → Developers → Webhooks → Add destination:** point at `https://your-app.vercel.app/api/payments/webhook` with the `checkout.session.completed` event, then copy its signing secret into `STRIPE_WEBHOOK_SECRET`
8. **Firebase Console → Authentication → Settings → Authorized domains:** add your Vercel domain

Redeploy after any env-var change.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit: `git commit -m "Add new feature"`
4. Push: `git push origin feature-name`
5. Open a pull request

---

## ⭐ Support

If this project is useful to you, please consider giving it a ⭐ on GitHub.

---

### 🚧 Planned Enhancements

* Role-based access (Admin / Agent / User)
* Map-based property discovery
* AI-powered price recommendations
* Saved searches & alerts
