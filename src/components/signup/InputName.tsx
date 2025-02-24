import { useState, KeyboardEvent, useEffect, useCallback } from "react";
import TextInput from "../auth/TextInput";
import { useSignupContext } from "@/hooks/use-signup-context";
import { inputNullCheck } from "@/utils/input-check/input-null-check";

export const InputName = () => {
  const [localName, setLocalName] = useState("");
  const { setName, checkTrigger } = useSignupContext();
  const [isNameValid, setIsNameValid] = useState(true);
  const [nameErrorMessage, setNameErrorMessage] = useState("");

  const setInvalidError = useCallback(() => {
    setIsNameValid(false);
    setNameErrorMessage("name is null");
  }, []);

  const clearInvalidError = useCallback(() => {
    setIsNameValid(true);
    setNameErrorMessage("");
  }, []);

  const handleNameSubmit = useCallback(() => {
    if (!inputNullCheck(localName)) {
      setInvalidError();
      return;
    }
    clearInvalidError();
    setName(localName);
  }, [localName, setInvalidError, clearInvalidError, setName]);

  useEffect(() => {
    if (checkTrigger) {
      handleNameSubmit();
    }
  }, [checkTrigger, handleNameSubmit]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNameSubmit();
    }
  };

  return (
    <TextInput
      title="Name"
      placeholder="Name"
      value={localName}
      onChange={(e) => setLocalName(e.target.value)}
      onBlur={handleNameSubmit}
      onKeyDown={handleKeyDown}
      invalid={!isNameValid}
      errorMessage={nameErrorMessage}
    />
  );
};