import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

type User = {
  id: number;
  email: string;
  name: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = (token: string) => {
    localStorage.setItem("token", token);
    loadUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login")
  };

  const loadUser = async () => {
    try {
      const res = await api.get("/me");
      setUser(res.data);
    } catch {
      logout();
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loadUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext)!;
}