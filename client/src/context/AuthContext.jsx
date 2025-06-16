import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useHref } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const SESSION_FIXED_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const sessionTimerRef = useRef(null); // Ref to store the timer ID

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");

    const expirationTime = Date.now() + SESSION_FIXED_DURATION; // Calculate future expiration time
    localStorage.setItem("sessionExpiration", expirationTime.toString()); 

    if (sessionTimerRef.current) {
        clearTimeout(sessionTimerRef.current); // Clear any old timer if it exists
    }
    sessionTimerRef.current = setTimeout(() => {
        console.log('Fixed session duration elapsed. Logging out...');
        logout(); 
    }, SESSION_FIXED_DURATION);
    console.log(`Login: Fixed session timer set for ${SESSION_FIXED_DURATION / 60000} minutes.`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem("isAuthenticated", "false");
    localStorage.setItem("userId",null)
    sessionStorage.clear(); 

    localStorage.removeItem("sessionExpiration"); 
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
    console.log("Client-side logout: session and timer cleared.");
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedExpiration = localStorage.getItem("sessionExpiration");

    if (storedAuth === "true" && storedExpiration) {
      const expirationTime = parseInt(storedExpiration, 10); 
      const now = Date.now();

      if (now < expirationTime) {
        setIsAuthenticated(true);
        const timeRemaining = expirationTime - now;
        if (sessionTimerRef.current) {
            clearTimeout(sessionTimerRef.current);
        }
        sessionTimerRef.current = setTimeout(() => {
            console.log('Stored session timer elapsed. Logging out...');
            logout(); 
        }, timeRemaining);
        console.log(`App Load: Session restored, timer set for ${timeRemaining / 1000} seconds.`);

      } else {
        console.log("App Load: Stored session has expired based on timestamp. Forcing logout...");
        logout(); 
      }
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("sessionExpiration");
      localStorage.removeItem("userId");
      sessionStorage.clear();
      if (sessionTimerRef.current) {
          clearTimeout(sessionTimerRef.current);
          sessionTimerRef.current = null;
      }
      console.log("App Load: No active session found or invalid storage.");
    }
    return () => {
      if (sessionTimerRef.current) {
        clearTimeout(sessionTimerRef.current);
        sessionTimerRef.current = null;
        console.log("AuthContext unmounted: Fixed session timer cleared.");
      }
    };
  }, []);
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};




