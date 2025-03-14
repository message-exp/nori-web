import { Interceptor } from "@connectrpc/connect";
import { storage } from "@/utils/storage/user-storage";
import { refreshUserToken } from "./user/user-access-service";

const PUBLIC_PATHS = [
  "/nori.v0.UserAccessService/RefreshUserToken",
  "/nori.v0.UserAccountService/Signup",
  "/nori.v0.UserAccountService/Login"
];

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

const REFRESH_BEFORE_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

const isTokenExpired = (accessToken: string): boolean => {
  const tokenData = JSON.parse(atob(accessToken.split(".")[1]));
  const expirationTime = tokenData.exp * 1000;
  return Date.now() >= (expirationTime - REFRESH_BEFORE_MS);
};

const handleTokenRefresh = async (userId: bigint, refreshToken: string) => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshUserToken(userId, refreshToken)
      .then(newAccessToken => {
        storage.refreshAccessToken(newAccessToken);
        return newAccessToken;
      })
      .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

export const authInterceptor: Interceptor = (next) => async (req) => {
  const servicePath = "/" + req.url.split("/").slice(3).join("/");

  if (PUBLIC_PATHS.includes(servicePath)) {
    return next(req);
  }

  const auth = storage.getUserAuth();
  if (!auth) {
    return next(req);
  }
  const userId = auth?.userId;
  const currentAccessToken = auth?.tokenPair.accessToken?.accessToken ?? "";
  const currentRefreshToken = auth?.tokenPair.refreshToken?.refreshToken ?? "";

  try {
    let finalAccessToken = currentAccessToken;

    if (isTokenExpired(currentAccessToken)) {
      if (!currentRefreshToken) {
        throw new Error("Refresh token not found");
      }

      const newTokens = await handleTokenRefresh(userId, currentRefreshToken);
      finalAccessToken = newTokens.accessToken;
    }

    req.header.set("authorization", `Bearer ${finalAccessToken}`);
    return next(req);
  } catch (error) {
    console.error("Authentication error:", error);
    isRefreshing = false;
    refreshPromise = null;
    throw error;
  }
};