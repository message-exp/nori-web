import { useState, KeyboardEvent, useEffect } from "react";
import TextInput from "../auth/TextInput";
import { useSignupContext } from "@/contexts/SignupContext";
import { inputNullCheck } from "@/utils/input-check/input-null-check";
import { inputEmailCheck } from "@/utils/input-check/input-email-check";

export const InputEmail = () => {
  const [localEmail, setLocalEmail] = useState("");
  const { setEmail, checkTrigger } = useSignupContext();
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const setInvalidError = (message: string) => {
    setIsEmailValid(false);
    setEmailErrorMessage(message);
  };

  const clearInvalidError = () => {
    setIsEmailValid(true);
    setEmailErrorMessage("");
  };

  const handleEmailSubmit = () => {
    if (inputNullCheck(localEmail) === false) {
      setInvalidError("email is null");
      return;
    }
    if (inputEmailCheck(localEmail) === false) {
      setInvalidError("invalid email format");
      return;
    }
    clearInvalidError();
    setEmail(localEmail);
  };

  useEffect(() => {
    if (checkTrigger) {
      handleEmailSubmit();
    } 
  }, [checkTrigger]);

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