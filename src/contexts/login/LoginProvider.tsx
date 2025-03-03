import React, { useState, ReactNode, useMemo, createContext } from "react";
import { LoginContextType } from "./login-types";

const LoginContext = createContext<LoginContextType | undefined>(undefined);

const LoginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkTrigger, setCheckTrigger] = useState(false);

  const value = useMemo(() => ({
    email,
    setEmail,
    password,
    setPassword,
    checkTrigger,
    setCheckTrigger
  }), [email, password, checkTrigger]);

  return (
    <LoginContext.Provider value={value}>
      {children}
    </LoginContext.Provider>
  );
};

export { LoginProvider, LoginContext };