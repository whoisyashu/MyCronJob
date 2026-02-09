import { useAuth } from "./context/authContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";

export default function App() {
  const { token } = useAuth();
  const [page, setPage] = useState("login");

  if (!token) {
    return (
      <div className="app-shell">
        {page === "login" ? (
          <Login onSwitch={() => setPage("register")} />
        ) : (
          <Register onSwitch={() => setPage("login")} />
        )}
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Dashboard />
    </div>
  );
}
