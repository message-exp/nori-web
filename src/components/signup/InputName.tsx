import { useState, KeyboardEvent, useEffect } from "react";
import TextInput from "../auth/TextInput";
import { useSignup } from "@/contexts/SignupContext";
import { inputNullCheck } from "@/utils/input-check/input-null-check";

export const InputName = () => {
  const [localName, setLocalName] = useState("");
  const { setName, checkTrigger } = useSignup();
  const [isNameValid, setIsNameValid] = useState(true);
  const [nameErrorMessage, setNameErrorMessage] = useState("");

  const setInvalidError = () => {
    setIsNameValid(false);
    setNameErrorMessage("name is null");
  };

  const clearInvalidError = () => {
    setIsNameValid(true);
    setNameErrorMessage("");
  };

  const handleNameSubmit = () => {
    if (inputNullCheck(localName) === false) {
      setInvalidError();
      return;
    }
    clearInvalidError();
    setName(localName);
    
  };

  useEffect(() => {
    if (checkTrigger) {
      handleNameSubmit();
    } 
  }, [checkTrigger]);

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