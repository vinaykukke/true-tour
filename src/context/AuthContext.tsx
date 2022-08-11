import React, { useContext, useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "src/firebase";

/** Auth Context */
const AuthContext = React.createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    login,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading && (
        <CircularProgress
          sx={{ position: "absolute", top: "50%", left: "50%" }}
        />
      )}
      {!loading && children}
    </AuthContext.Provider>
  );
};
