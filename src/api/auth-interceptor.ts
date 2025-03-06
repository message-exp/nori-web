import { Interceptor } from "@connectrpc/connect";
import { storage } from "@/utils/storage/user-storage";

export const authInterceptor: Interceptor = (next) => async (req) => {
  // get token from storage
  const storageUtil = storage.getUserAuth();
  if (!storageUtil) {
    return await next(req);
  }
  const token = storageUtil?.tokenPair.accessToken?.accessToken;
    
  // set token in request header
  if (token) {
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000; // 轉換為毫秒
      
      if (Date.now() >= expirationTime) {
        
      }

      // 如果 token 有效，加入到 header
      req.header.set("authorization", `Bearer ${token}`);
    } catch (error) {
      // token 解析失敗或其他錯誤
      console.error('Token validation failed:', error);
      throw error;
    }
  }

  // continue with request
  return await next(req);
};
