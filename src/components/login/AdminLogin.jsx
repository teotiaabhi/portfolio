import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // adjust path if needed
import "./AdminLogin.css";

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");
  const [recoveryMsg, setRecoveryMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminCredentials = async () => {
      try {
        const docRef = doc(db, "admin", "credentials");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAdmin(docSnap.data());
          console.log("Admin credentials fetched");
        } else {
          console.warn("No admin credentials found in Firestore.");
          setError("Admin credentials not set. Contact support.");
        }
      } catch (error) {
        console.error("Error fetching admin credentials:", error);
        setError("Failed to load admin credentials. Try again later.");
      }
    };

    fetchAdminCredentials();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setRecoveryMsg("");

    if (!admin) {
      setError("Admin credentials are not loaded yet.");
      return;
    }

    if (email === admin.email && password === admin.password) {
      localStorage.setItem("adminEmail", email);
      if (onLogin) onLogin();
      navigate("/admin/panel");
    } else {
      setError("❌ Invalid email or password.");
    }
  };

  const handleForgot = () => {
    if (admin) {
      setRecoveryMsg(`🧾 Admin Credentials:\nEmail: ${admin.email}\nPassword: ${admin.password}`);
    } else {
      setRecoveryMsg("Admin credentials not available.");
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-box" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button type="submit" className="login-btn">
          Login
        </button>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <div className="forgot-password mt-3">
          <button type="button" onClick={handleForgot} className="text-blue-600 underline">
            Forgot Password?
          </button>
        </div>

        {/* {recoveryMsg && (
          <pre className="text-green-600 text-sm whitespace-pre-wrap mt-3">{recoveryMsg}</pre>
        )} */}
      </form>
    </div>
  );
};

export default AdminLogin;
