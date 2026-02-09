import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/authContext";

export default function Register({ onSwitch }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async e => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", {
        email,
        password
      });
      login(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="auth-card">
      <div>
        <p className="eyebrow">MyCronJob</p>
        <h2 className="auth-title">Register</h2>
        <p className="auth-subtitle">Create your uptime command center.</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      <form className="auth-form" onSubmit={submit}>
        <label className="field">
          <span>Email</span>
          <input
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>

        <button className="btn btn-primary" type="submit">
          Create account
        </button>
      </form>

      <div className="switch-row">
        <span>Already have an account?</span>
        <button className="btn btn-ghost" type="button" onClick={onSwitch}>
          Login
        </button>
      </div>
    </div>
  );
}
