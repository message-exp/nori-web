export const HOME_SERVER = import.meta.env.VITE_HOME_SERVER || "matrix.org";

// 在開發模式使用 Vite proxy（相對路徑），生產模式直接連接 server
export const CONTACTS_SERVER =
  import.meta.env.MODE === "development"
    ? "" // 使用 Vite proxy 避免 CORS 問題
    : import.meta.env.VITE_CONTACTS_SERVER || "http://localhost:8000";
