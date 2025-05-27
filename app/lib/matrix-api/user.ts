import { getHttpUriForMxc, type User } from "matrix-js-sdk";
import { client } from "~/lib/matrix-api/client";
import { refreshToken } from "./refresh-token";

export function getUser(userId: string): User | null {
  return client.client.getUser(userId);
}

export async function getCurrentUser(): Promise<User | null> {
  let currentUserId = client.client.getUserId();

  // 如果沒有獲取到當前用戶ID，嘗試刷新token
  if (!currentUserId) {
    const refreshResult = await refreshToken();
    if (refreshResult === "REFRESH_SUCCESS") {
      // 如果刷新成功，再次嘗試獲取用戶ID
      currentUserId = client.client.getUserId();
    }
  }

  if (!currentUserId) {
    return null;
  } else {
    return getUser(currentUserId);
  }
}

export function getUserAvatar(user: User | null) {
  if (!user) {
    return undefined;
  }
  // const baseUrl = splitUsername(user.userId).domain;
  const mxcUrl = user.avatarUrl;
  const baseUrl = client.client.baseUrl;
  return mxcUrl
    ? getHttpUriForMxc(baseUrl, mxcUrl, 40, 40, "scale")
    : undefined;
}
