import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupContext } from "@/hooks/use-signup-context";
import { useSignupAuth } from "@/hooks/use-signup-auth";

export const useSignupSubmit = () => {
  const navigate = useNavigate();
  const signupAuth = useSignupAuth;
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [textErrorMessage, setTextErrorMessage] = useState("");

  const {
    name,
    email,
    password,
    confirmPassword,
    checkTrigger,
    setCheckTrigger
  } = useSignupContext();

  const handleSignup = async () => {
    setCheckTrigger(!checkTrigger);
    setIsSignupLoading(true);
    
    const signupResponse = await signupAuth(name, email, password, confirmPassword);
    if (signupResponse.success === true) {
      setTextErrorMessage("");
      navigate("/roomlist");
    } else {
      setTextErrorMessage(signupResponse.errors);
    }
    
    setIsSignupLoading(false);
  };

  return {
    isSignupLoading,
    textErrorMessage,
    handleSignup,
  };
};