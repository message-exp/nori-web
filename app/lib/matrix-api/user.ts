import { type User } from "matrix-js-sdk";
import { client } from "~/lib/matrix-api/client";
import { getImageObjectUrl } from "./utils";

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

export async function getUserAvatar(user: User | null) {
  if (!user) {
    console.log("user not found");
    return undefined;
  }
  const mxcUrl = user.avatarUrl;
  if (!mxcUrl) {
    console.log("user avatar not found");
    return undefined;
  }

  const returnUrl = await getImageObjectUrl(mxcUrl);
  console.log("return url: ", returnUrl);
  return returnUrl;
}
