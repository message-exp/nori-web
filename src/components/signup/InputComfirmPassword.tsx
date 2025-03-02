import { useState, KeyboardEvent, useEffect, useCallback } from "react";
import TextInput from "../auth/TextInput";
import { useSignupContext } from "@/hooks/use-signup-context";
import { inputNullCheck } from "@/utils/input-check/input-null-check";

export const InputConfirmPassword = () => {
  const [localConfirmPassword, setLocalConfirmPassword] = useState("");
  const { password, setConfirmPassword, checkTrigger } = useSignupContext();
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");

  const setInvalidError = useCallback((message: string) => {
    setIsConfirmPasswordValid(false);
    setConfirmPasswordErrorMessage(message);
  }, []);

  const clearInvalidError = useCallback(() => {
    setIsConfirmPasswordValid(true);
    setConfirmPasswordErrorMessage("");
  }, []);

  const checkPassword = useCallback(() => {
    return localConfirmPassword === password;
  }, [localConfirmPassword, password]);

  const handleCheckComfirmPassword = useCallback(() => {
    if (!checkPassword()) {
      setInvalidError("passwords do not match");
    } else {
      clearInvalidError();
    }
  }, [checkPassword, setInvalidError, clearInvalidError]);

  const handleConfirmPasswordSubmit = useCallback(() => {
    if (!inputNullCheck(localConfirmPassword)) {
      setInvalidError("confirm password is null");
      return;
    }
    if (!checkPassword()) {
      setInvalidError("passwords do not match");
      return;
    }

    clearInvalidError();
    setConfirmPassword(localConfirmPassword);
  }, [localConfirmPassword, checkPassword, setInvalidError, clearInvalidError, setConfirmPassword]);


  useEffect(() => {
    handleCheckComfirmPassword();
  }, [localConfirmPassword, handleCheckComfirmPassword]);

  useEffect(() => {
    if (checkTrigger) {
      handleConfirmPasswordSubmit();
    }
  }, [checkTrigger, handleConfirmPasswordSubmit]);

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