import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="container mt-4">
      {user ? (
        <>
          <h2>Welcome, {user.name}</h2>
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <h2>Not logged in</h2>
      )}
    </div>
  );
}