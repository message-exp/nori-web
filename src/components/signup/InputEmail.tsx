import { useState, KeyboardEvent, useEffect, useCallback } from "react";
import TextInput from "../auth/TextInput";
import { useSignupContext } from "@/hooks/use-signup-context";
import { inputNullCheck } from "@/utils/input-check/input-null-check";
import { inputEmailCheck } from "@/utils/input-check/input-email-check";

export const InputEmail = () => {
  const [localEmail, setLocalEmail] = useState("");
  const { setEmail, checkTrigger } = useSignupContext();
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const setInvalidError = useCallback((message: string) => {
    setIsEmailValid(false);
    setEmailErrorMessage(message);
  }, []);

  const clearInvalidError = useCallback(() => {
    setIsEmailValid(true);
    setEmailErrorMessage("");
  }, []);

  const handleEmailSubmit = useCallback(() => {
    if (!inputNullCheck(localEmail)) {
      setInvalidError("email is null");
      return;
    }
    if (!inputEmailCheck(localEmail)) {
      setInvalidError("invalid email format");
      return;
    }
    clearInvalidError();
    setEmail(localEmail);
  }, [localEmail, setInvalidError, clearInvalidError, setEmail]);

  useEffect(() => {
    if (checkTrigger) {
      handleEmailSubmit();
    }
  }, [checkTrigger, handleEmailSubmit]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEmailSubmit();
    }
  };

  return (
    <TextInput
      title="Email"
      placeholder="Email"
      value={localEmail}
      onChange={(e) => setLocalEmail(e.target.value)}
      onBlur={handleEmailSubmit}
      onKeyDown={handleKeyDown}
      invalid={!isEmailValid}
      errorMessage={emailErrorMessage}
    />
  );
};