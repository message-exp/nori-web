import { useState, KeyboardEvent, useEffect } from "react";
import TextInput from "../auth/TextInput";
import { useSignupContext } from "@/contexts/SignupContext";
import { inputNullCheck } from "@/utils/input-check/input-null-check";

export const InputConfirmPassword = () => {
  const [localConfirmPassword, setLocalConfirmPassword] = useState("");
  const { password, setConfirmPassword, checkTrigger } = useSignupContext();
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");

  const setInvalidError = (message: string) => {
    setIsConfirmPasswordValid(false);
    setConfirmPasswordErrorMessage(message);
  };

  const clearInvalidError = () => {
    setIsConfirmPasswordValid(true);
    setConfirmPasswordErrorMessage("");
  };

  const checkPassword = () => {
    if (localConfirmPassword !== password) {
      return false;
    }
    else {
      return true;
    }
  }

  const handleCheckComfirmPassword = () => {
    if (checkPassword() === false) {
      setInvalidError("passwords do not match");
    }
    else {
      clearInvalidError();
    }
  };

  const handleConfirmPasswordSubmit = () => {
    if (inputNullCheck(localConfirmPassword) === false) {
      setInvalidError("confirm password is null");
      return;
    }
    if (checkPassword() === false) {
      setInvalidError("passwords do not match");
      return;
    } 
    
    clearInvalidError();
    setConfirmPassword(localConfirmPassword);
  };

  useEffect(() => {
    handleCheckComfirmPassword();
  }, [localConfirmPassword]);

  useEffect(() => {
    if (checkTrigger) {
      handleConfirmPasswordSubmit();
    }
  }, [checkTrigger]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConfirmPasswordSubmit();
    }
  };

  return (
    <TextInput
      title="Confirm Password"
      placeholder="Confirm Password"
      password
      value={localConfirmPassword}
      onChange={(e) => setLocalConfirmPassword(e.target.value)}
      onBlur={handleConfirmPasswordSubmit}
      onKeyDown={handleKeyDown}
      invalid={!isConfirmPasswordValid}
      errorMessage={confirmPasswordErrorMessage}
    />
  );
};