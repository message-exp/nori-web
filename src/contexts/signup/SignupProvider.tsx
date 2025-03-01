import React, { useState, ReactNode, useMemo, createContext } from "react";
import { SignupContextType } from "./signup-types";

const SignupContext = createContext<SignupContextType | undefined>(undefined);

const SignupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkTrigger, setCheckTrigger] = useState(false);

  const value = useMemo(() => ({
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    checkTrigger,
    setCheckTrigger
  }), [name, email, password, confirmPassword, checkTrigger]);

  return (
    <SignupContext.Provider value={value}>
      {children}
    </SignupContext.Provider>
  );
};

export {SignupProvider, SignupContext};