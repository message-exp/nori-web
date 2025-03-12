import { TokenPair, TokenPairSchema, UserTokenPair } from "@/proto-generated/nori/v0/user/access/token_pairs_pb";
import { getUserIdFromAccessToken } from "../jwt";
import { create } from "@bufbuild/protobuf";
import { AccessToken, AccessTokenSchema } from "@/proto-generated/nori/v0/user/access/access_token_pb";

interface UserAuth {
  userId: bigint;
  tokenPair: TokenPair;
}

export const storage = {
  setUserAuth: ({ userId, tokenPair }: UserAuth) => {
    localStorage.setItem(
      "userAuth",
      JSON.stringify({ userId: String(userId), tokenPair })
    );
  },

  getUserAuth: (): UserAuth | null => {
    const userAuth = localStorage.getItem("userAuth");
    if (!userAuth) return null;
    const data = JSON.parse(userAuth) as { userId: string; tokenPair: TokenPair };
    if (!data.userId) {
      console.log("data userid null");
      return null;
    }  
    return { userId: BigInt(data.userId), tokenPair: data.tokenPair };
  },

  getUserId: (): bigint | null => {
    const userAuth = storage.getUserAuth();
    return userAuth ? userAuth.userId : null;
  },

  getTokenPair: (): TokenPair | null => {
    const userAuth = storage.getUserAuth();
    return userAuth ? userAuth.tokenPair : null;
  },

  clearUserAuth: () => {
    localStorage.removeItem("userAuth");
  },

  saveToken: (inputToken: TokenPair | UserTokenPair) => {
    try {
      if ("userId" in inputToken) {
        // 處理 UserTokenPair
        const userId = inputToken.userId;
        if (!userId) throw new Error("userId is null or undifinded");
        const tokenPair = create(TokenPairSchema, {
          accessToken: inputToken.accessToken,
          refreshToken: inputToken.refreshToken
        });
        storage.setUserAuth({
          userId: userId.id,
          tokenPair: tokenPair
        });
      } else {
        // 處理 TokenPair
        const userId = getUserIdFromAccessToken(inputToken.accessToken);
        const tokenPair = create(TokenPairSchema, {
          accessToken: inputToken.accessToken,
          refreshToken: inputToken.refreshToken
        });
        storage.setUserAuth({
          userId: userId.id,
          tokenPair: tokenPair
        });
      }
    } catch (error) {
      console.error("save token error: ", error);
    }
  },

  refreshAccessToken: (newAccessToken: AccessToken) => {
    const currentAuth = storage.getUserAuth();
    if (!currentAuth) {
      console.error("No existing auth found to refresh");
      return;
    }

    const updatedTokenPair = create(TokenPairSchema, {
      accessToken: newAccessToken,
      refreshToken: currentAuth.tokenPair.refreshToken
    });

    storage.setUserAuth({
      userId: currentAuth.userId,
      tokenPair: updatedTokenPair
    });
  },

};
