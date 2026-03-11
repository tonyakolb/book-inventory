import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">
        Book Inventory
      </Link>

      <Link className="nav-link text-white" to="/inventories">
        Inventories
      </Link>
      
      <div className="ms-auto d-flex align-items-center gap-3">
        {user ? (
          <>
            <span className="text-white">
              {user.name} ({user.role})
            </span>
            <button className="btn btn-outline-light btn-sm" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline-light btn-sm" to="/login">
              Login
            </Link>
            <Link className="btn btn-warning btn-sm" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}