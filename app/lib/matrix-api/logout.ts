import { client } from "./client";
import { removeAuthCookies } from "~/lib/utils";

export async function logout(): Promise<boolean> {
  try {
    if (!client.client) {
      console.error("Matrix client is not initialized");
      return false;
    }

    // 執行 Matrix SDK 的登出方法
    await client.client.logout();

    // 清除本地儲存的認證 cookies
    removeAuthCookies();

    console.log("Logout successful");
    return true;
  } catch (error) {
    console.error("Failed to logout:", error);
    return false;
  }
}
