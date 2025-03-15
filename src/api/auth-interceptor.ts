import { Interceptor } from "@connectrpc/connect";
import { storage } from "@/utils/storage/user-storage";
import { refreshUserToken } from "./user/user-access-service";

const PUBLIC_PATHS = [
  "/nori.v0.UserAccessService/RefreshUserToken",
  "/nori.v0.UserAccountService/Signup",
  "/nori.v0.UserAccountService/Login"
];

interface RefreshQueueItem {
  resolve: (value: string) => void;
  reject: (error: any) => void;
}

let isRefreshing = false;
let refreshQueue: RefreshQueueItem[] = [];

const processQueue = (token: string, error: any = null) => {
  refreshQueue.forEach(item => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve(token);
    }
  });
  refreshQueue = [];
};

const refreshAccessToken = async (userId: bigint, refreshToken: string): Promise<string> => {
  try {
    if (!isRefreshing) {
      isRefreshing = true;
      const newTokens = await refreshUserToken(userId, refreshToken);
      storage.refreshAccessToken(newTokens);
      isRefreshing = false;
      processQueue(newTokens.accessToken);
      return newTokens.accessToken;
    } else {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      });
    }
  } catch (error) {
    isRefreshing = false;
    processQueue("", error);
    throw error;
  }
};

const isTokenExpired = (accessToken: string): boolean => {
  try {
    const tokenData = JSON.parse(atob(accessToken.split(".")[1]));
    return Date.now() + (5 * 60* 1000) >= tokenData.exp * 1000;
  } catch {
    return true;
  }
};

export const authInterceptor: Interceptor = (next) => async (req) => {
  const servicePath = "/" + req.url.split("/").slice(3).join("/");

  // 如果是公開路徑，直接通過
  if (PUBLIC_PATHS.includes(servicePath)) {
    return next(req);
  }

  // 如果沒有儲存認證資訊，直接通過
  const auth = storage.getUserAuth();
  if (!auth) {
    return next(req);
  }

  const { userId, tokenPair } = auth;
  let accessToken = tokenPair.accessToken?.accessToken;
  const refreshToken = tokenPair.refreshToken?.refreshToken;

  // 如果 token 過期且有 refresh token，則更新
  if (accessToken && isTokenExpired(accessToken) && refreshToken) {
    accessToken = await refreshAccessToken(userId, refreshToken);
  }

  // 如果有 access token（不管是新的還是舊的），加到 header
  if (accessToken) {
    req.header.set("authorization", `Bearer ${accessToken}`);
  }

  return next(req);
};