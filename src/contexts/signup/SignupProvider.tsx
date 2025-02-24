import React, { useState, ReactNode, useMemo } from "react";
import { SignupContext } from "./signup-context";

export const SignupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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