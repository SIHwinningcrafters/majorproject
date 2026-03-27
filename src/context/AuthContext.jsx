import { createContext, useContext, useState, useEffect } from "react";
import {
  login   as apiLogin,
  signup  as apiSignup,
  logout  as apiLogout,
  getMe,
  getStoredUser,
} from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  /* restore user from localStorage on first load */
  const [user,    setUser]    = useState(getStoredUser);
  const [loading, setLoading] = useState(true);

  /* verify token is still valid on mount */
  useEffect(() => {
    const verify = async () => {
      if (getStoredUser()) {
        try {
          const freshUser = await getMe();
          setUser(freshUser);
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    };
    verify();
  }, []);

  const login = async (credentials) => {
    const data = await apiLogin(credentials);
    setUser(data.user);
    return data;
  };

  const signup = async (userData) => {
    const data = await apiSignup(userData);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
// import { createContext, useContext, useState } from "react";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null); // null = not logged in

//   const login = (userData) => setUser(userData);
//   const logout = () => setUser(null);
//   const signup = (userData) => setUser(userData);

//   return (
//     <AuthContext.Provider value={{ user, login, logout, signup }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);