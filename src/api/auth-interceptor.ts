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
        const tokenString = new TextDecoder().decode(token); // convert bytes to string
        req.header.set("authorization", tokenString);
    }

    // continue with request
    return await next(req);
};
