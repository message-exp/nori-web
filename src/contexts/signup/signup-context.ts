import { createContext } from "react";
import { SignupContextType } from "./signup-types";

export const SignupContext = createContext<SignupContextType | undefined>(undefined);