import { useState, KeyboardEvent, useEffect, useCallback } from "react";
import TextInput from "../auth/TextInput";
import { useLoginContext } from "@/hooks/use-login-context";
import { inputNullCheck } from "@/utils/input-check/input-null-check";

export const InputPassword = () => {
  const [localPassword, setLocalPassword] = useState("");
  const { setPassword, checkTrigger } = useLoginContext();
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const setInvalidError = useCallback((message: string) => {
    setIsPasswordValid(false);
    setPasswordErrorMessage(message);
  }, []);

  const clearInvalidError = useCallback(() => {
    setIsPasswordValid(true);
    setPasswordErrorMessage("");
  }, []);

  const handlePasswordSubmit = useCallback(() => {
    if (!inputNullCheck(localPassword)) {
      setInvalidError("password is null");
      return;
    }
    clearInvalidError();
    setPassword(localPassword);
  }, [localPassword, setInvalidError, clearInvalidError, setPassword]);

  useEffect(() => {
    if (checkTrigger) {
      handlePasswordSubmit();
    }
  }, [checkTrigger, handlePasswordSubmit]);

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