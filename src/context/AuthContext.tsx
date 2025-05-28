// AuthContext.tsx
import React, { createContext, useContext } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { User } from "../types/user.type";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = useSelector(
    (state: RootState) => state.auth?.currentUser?.data?.token
  );
  const user = useSelector(
    (state: RootState) => state.auth?.currentUser?.data?.user ?? null
  );
  // console.log("user--->", user);
  // console.log("token--->", token);
  

  const isAuthenticated = Boolean(token);

  // console.log("isAuthenticated-->", isAuthenticated);
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
