# PassOP - Password Manager 🔐

A modern full-stack MERN password manager with a clean SaaS-style UI, dark/light mode support, and secure credential management experience.

## ✨ Highlights

- Beautiful responsive dashboard (mobile + desktop)
- Dark/Light theme toggle with smooth transitions
- Add, list, copy, show/hide, and delete passwords
- Card-based UI with modern spacing and glassmorphism feel
- Fast React frontend powered by Vite

## 🧱 Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- Lucide React Icons

### Backend
- Node.js + Express
- MongoDB

## 📡 Backend API (used by frontend)

- `GET http://localhost:5000/passwords`
- `POST http://localhost:5000/add`
- `DELETE http://localhost:5000/delete/:id`

## 🚀 Getting Started

### 1) Clone and install

```bash
git clone <your-repo-url>
cd passop
npm install
```

### 2) Start backend

Make sure your backend server is running at `http://localhost:5000` with the routes above.

### 3) Run frontend

```bash
npm run dev
```

Open: `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production app
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```text
src/
	components/
		Manager.jsx
		AddPassword.jsx
		Navbar.jsx
	assets/
	App.jsx
	index.css
```

## 🎨 UI Features

- Gradient + glassmorphism style container
- Password input show/hide toggle
- Per-card show/hide toggle
- Copy-to-clipboard action
- Delete with confirmation

## 🌗 Theme Notes

- Theme preference is stored in `localStorage`
- Tailwind is configured for class-based dark mode via `darkMode: "class"`

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you want to improve.

## 📄 License

Use this project for learning and personal development.
