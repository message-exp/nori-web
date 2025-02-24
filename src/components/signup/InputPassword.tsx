import { useState, KeyboardEvent, useEffect } from "react";
import TextInput from "../auth/TextInput";
import { useSignup } from "@/contexts/SignupContext";
import { inputNullCheck } from "@/utils/input-check/input-null-check";

export const InputPassword = () => {
  const [localPassword, setLocalPassword] = useState("");
  const { setPassword, checkTrigger } = useSignup();
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const setInvalidError = (message: string) => {
    setIsPasswordValid(false);
    setPasswordErrorMessage(message);
  };

  const clearInvalidError = () => {
    setIsPasswordValid(true);
    setPasswordErrorMessage("");
  };

  const handlePasswordSubmit = () => {
    if (inputNullCheck(localPassword) === false) {
      setInvalidError("password is null");
      return;
    }
    clearInvalidError();
    setPassword(localPassword);
  };

  useEffect(() => {
    if (checkTrigger) {
      handlePasswordSubmit();
    } 
  }, [checkTrigger]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePasswordSubmit();
    }
  };

  return (
    <TextInput
      title="Password"
      password
      placeholder="password"
      value={localPassword}
      onChange={(e) => setLocalPassword(e.target.value)}
      onBlur={handlePasswordSubmit}
      onKeyDown={handleKeyDown}
      invalid={!isPasswordValid}
      errorMessage={passwordErrorMessage}
    />
  );
};