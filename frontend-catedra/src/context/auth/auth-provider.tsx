import { useState, useEffect, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "./auth-context";
import type { User } from "../../interfaces/user.interface";
import { getProfile, loginAxios } from "../../api/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const userData = await getProfile();
      setUser(userData.data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<User> => {
    const userData = await loginAxios({ username, password });
    localStorage.setItem("token-catedra", userData.token);

    const userFromApi = await getProfile();
    setUser(userFromApi.data);

    return userFromApi.data;
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
