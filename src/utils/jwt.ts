import { AccessToken } from "@/proto-generated/nori/v0/user/access_token_pb";
import { UserId } from "@/proto-generated/nori/v0/user/user_id_pb";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
    userId: UserId;
};

export const getUserIdFromAccessToken = (token?: AccessToken): UserId => {
    if (!token?.accessToken) {
        throw new Error('Access token is missing or invalid');
    }

    try {
        const tokenString = new TextDecoder().decode(token.accessToken);
        const decoded = jwtDecode<JWTPayload>(tokenString);
        console.log(decoded);
        return decoded.userId;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        throw error;
    }
};