import { Interceptor } from "@connectrpc/connect";
import { storage } from "@/utils/storage/user-storage";
import { refreshUserToken } from "./user/user-access-service";

export const authInterceptor: Interceptor = (next) => async (req) => {
  // get token from storage
  const storageUtil = storage.getUserAuth();
  if (!storageUtil) {
    return await next(req);
  }
  const userId = storageUtil.userId
  const accessToken = storageUtil?.tokenPair.accessToken?.accessToken;
  const refreshToken = storageUtil?.tokenPair.refreshToken?.refreshToken;
    
  // set token in request header
  if (accessToken) {
    try {
      const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = tokenData.exp * 1000; // 轉換為毫秒
      let requestAccessToken = accessToken;
      
      if (Date.now() >= expirationTime) {
        if (refreshToken) {
          const newAccessToken = await refreshUserToken(userId, refreshToken);
          requestAccessToken = newAccessToken.accessToken;
          storage.refreshAccessToken(newAccessToken);
        } else {
          throw Error("refresh token is not exist");
        }
        
      }

      // 如果 token 有效，加入到 header
      req.header.set("authorization", `Bearer ${requestAccessToken}`);
    } catch (error) {
      // token 解析失敗或其他錯誤
      console.error('Token validation failed:', error);
      throw error;
    }
  }

  // continue with request
  return await next(req);
};
