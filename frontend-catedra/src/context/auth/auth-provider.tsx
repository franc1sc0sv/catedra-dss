import { useState, useEffect, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "./auth-context";
import { authApi } from "../../api/auth";
import type { User } from "../../interfaces/user.interface";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const userData = await authApi.me();
      setUser(userData.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    const userData = await authApi.login(email, password);
    localStorage.setItem("token-catedra", userData.token);

    const userFromApi = await authApi.me();
    setUser(userFromApi.user);

    return userFromApi.user;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("token-catedra");
    window.location.href = "/";
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
