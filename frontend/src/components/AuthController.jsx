import { createContext, useContext, useState } from "react";

import BASE_URL from "../config.js";
import axios from "axios";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setloggedIn] = useState(false);
  const storedToken = (serverToken) => {
    return localStorage.setItem("token", serverToken);
  };

  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return { loggedIn: false, status: 401 };
    }
    const server = { token: token };

    try {
      const response = await axios.post(`${BASE_URL}/api/verify`, server);
      return {
        loggedIn: response.status === 200 || response.status === 201,
        status: response.status,
      };
    } catch (error) {
      return {
        loggedIn: false,
        status: error.response ? error.response.status : 500,
      };
    }
  };
  return (
    <AuthContext.Provider value={{ storedToken, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
