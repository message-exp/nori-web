export const inputNullCheck = (value: any): boolean => {
  // 檢查 null 或 undefined
  if (value == null) return false;

  // 檢查空字串
  if (typeof value === "string") {
    if (value.trim().length === 0) return false;
    else return true;
  }

  // 檢查空陣列
  if (Array.isArray(value)) {
    if (value.length === 0) return false;
    else return true;
  }

  // 檢查空物件
  if (typeof value === "object") {
    if (Object.keys(value).length === 0) return false;
    else return true;
  }

  return true;
};
