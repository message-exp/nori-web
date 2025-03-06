import { UserAccessService } from "@/proto-generated/nori/v0/user/access/user_access_service_pb";
import { createClient } from "@connectrpc/connect";
import { transport } from "../client";
import { UserRefreshToken } from "@/proto-generated/nori/v0/user/access/token_pairs_pb";
import { AccessToken } from "@/proto-generated/nori/v0/user/access/access_token_pb";
import { storage } from "@/utils/storage/user-storage";


const client = createClient(UserAccessService, transport);

export const RefreshUserToken = async (inputUserRefreshToken?: UserRefreshToken | null): Promise<AccessToken> => {
    const refreshToken = inputUserRefreshToken ?? storage.getUserRefreshToken();
    
    if (!refreshToken) {
        throw new Error("No refresh token available");
    }
    try {
        const response = await client.refreshUserToken(refreshToken);
        console.log("Refresh Token successfully", response);
        return response;
    } catch (error) {
        console.error("Failed to refresh token", error);
        throw error;
    }
};