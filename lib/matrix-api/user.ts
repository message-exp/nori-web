import { getHttpUriForMxc, type User } from "matrix-js-sdk";
import { client } from "@/lib/matrix-api/client";

export function getUser(userId: string): User | null {
  return client.client.getUser(userId);
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
