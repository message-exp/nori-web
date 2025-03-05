import { inputNullCheck } from "./input-null-check";

export const inputEmailCheck = (email: string): boolean => {
  // 先檢查是否為空
  if (inputNullCheck(email) === false) return false;
  
  // 檢查 email 格式
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};