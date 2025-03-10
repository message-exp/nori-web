export interface LoginContextType {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  checkTrigger: boolean;
  setCheckTrigger: (checkTrigger: boolean) => void;
}