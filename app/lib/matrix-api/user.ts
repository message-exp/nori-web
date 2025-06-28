import { getHttpUriForMxc, type User } from "matrix-js-sdk";
import { client } from "~/lib/matrix-api/client";

export function getUser(userId: string): User | null {
  return client.client.getUser(userId);
}

export async function getCurrentUser(): Promise<User | null> {
  const currentUserId = client.client.getUserId();
  if (!currentUserId) {
    return null;
  }
  return getUser(currentUserId);
}

export function getUserAvatar(user: User | null) {
  if (!user) {
    return undefined;
  }
  const mxcUrl = user.avatarUrl;
  const baseUrl = client.client.baseUrl;
  return mxcUrl
    ? getHttpUriForMxc(baseUrl, mxcUrl, 40, 40, "scale")
    : undefined;
}
