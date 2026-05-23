# 🏠 BRICKnCLICK

A modern, full‑stack **Property Listing Web Application** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). BRICKnCLICK provides a smooth, real‑world real‑estate experience where users can list properties, explore listings with advanced filters, chat with owners, and visualize market insights — all through a clean and responsive UI.

---

## 🚀 Key Features

### 🔐 Authentication & Security

* JWT‑based user authentication
* Secure protected routes
* User‑specific favorites and chats

### 🏡 Property Management

* Create, update, delete, and view property listings
* Upload property images using Cloudinary
* Mark and manage favorite listings

### 🔍 Smart Search & Discovery

* Advanced search with multiple filters:

  * Price range
  * Amenities
  * Sale / Rent type
  * Location
* Interactive graph visualizations for top listings

### 💬 Communication

* Real‑time chat with property owners
* Seamless in‑app messaging experience

### ⚡ UI & Performance

* Fully responsive and modern interface
* Built with React and Tailwind CSS
* Optimized state management using Redux Toolkit

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Redux Toolkit
* Axios
* Tailwind CSS
* Chart.js / Recharts

### Backend

* Node.js
* Express.js
* MongoDB with Mongoose

### Other Tools & Services

* JSON Web Tokens (JWT)
* Cloudinary (Image Storage)

---

## ⚙️ Installation & Setup

Follow the steps below to run BRICKnCLICK locally:

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/samar-2004/BRICKnCLICK.git
cd BRICKnCLICK
```

### 2️⃣ Environment Variables

Create a `.env` file in the root directory and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3️⃣ Install Dependencies

**Backend**

```bash
cd backend
npm install
```

**Frontend**

```bash
cd ../frontend
npm install
```

### 4️⃣ Run the Application

**Start Backend Server**

```bash
cd backend
npm run dev
```

**Start Frontend**

```bash
cd ../frontend
npm start
```

---

## 🌐 Application URLs

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 🤝 Contributing

Contributions are always welcome! 🚀

1. Fork the repository
2. Create your feature branch

   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes

   ```bash
   git commit -m "Added new feature"
   ```
4. Push to the branch

   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request

---

## 🧑‍💻 Author

**Muhammad Zohaib Rashid**
Software Engineer | MERN Stack Developer

* 📧 Email: [zohaibrashid999@gmail.com](mailto:zohaibrashid999@gmail.com)
* 🌐 GitHub: [https://github.com/zohaibfast99](https://github.com/zohaibfast99)
* 🔗 LinkedIn: [https://www.linkedin.com/in/zohaib-rashid2323/](https://www.linkedin.com/in/zohaib-rashid2323/)

---

## ⭐ Support

If you find this project useful, please consider giving it a ⭐ on GitHub.

Your support motivates continuous improvement and future enhancements!

---

### 🚧 Future Enhancements (Planned)

* Role‑based access (Admin / Agent / User)
* Map‑based property discovery
* AI‑powered price recommendations
* Saved searches & alerts

---

**BRICKnCLICK** — where property discovery meets modern web technology 🏡✨
