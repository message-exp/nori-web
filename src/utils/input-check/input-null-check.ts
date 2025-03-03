export const inputNullCheck = (value: string | null | undefined): boolean => {
  // 檢查 null 或 undefined
  if (!value) return false;

  // 檢查空字串
  if (typeof value === "string") {
    if (value.trim().length === 0) return false;
    return true;
  }

  // 檢查空物件
  if (typeof value === "object") {
    if (Object.keys(value).length === 0) return false;
    return true;
  }

  return true;
};