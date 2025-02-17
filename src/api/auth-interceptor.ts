import { Interceptor } from "@connectrpc/connect";
import { storage } from "@/utils/storage/user-storage";

export const authInterceptor: Interceptor = (next) => async (req) => {
    // get token from storage
    const storageUtil = storage.getUserAuth();
    if (!storageUtil) {
        return await next(req);
    }
    const token = storageUtil?.tokenpair.accessToken?.accessToken;
    
    // set token in request header
    if (token) {
        req.header.set("authorization", `Bearer ${token}`);
    }

    // continue with request
    return await next(req);
};
