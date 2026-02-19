import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Manager from "./components/Manager";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

/* ===============================
   PROTECTED ROUTE COMPONENT
=============================== */

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />; 
  }

  return children;
};

/* ===============================
   APP COMPONENT
=============================== */

function App() {
  return (
    <Router>
      <Routes>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Manager />
            </ProtectedRoute>
          }
        />

        {/* If route not found */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
