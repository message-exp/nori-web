import { TokenPair } from "@/proto-generated/nori/v0/user/token_pair_pb";
import { getUserIdFromAccessToken } from "../jwt";
import { UserRefreshToken, UserRefreshTokenSchema } from "@/proto-generated/nori/v0/user/access/token_pairs_pb";
import { create } from "@bufbuild/protobuf";
import { UserIdSchema } from "@/proto-generated/nori/v0/user/user_id_pb";
import { RefreshTokenSchema } from "@/proto-generated/nori/v0/user/access/refresh_token_pb";

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

  getUserRefreshToken: (): UserRefreshToken | null => {
    const userAuth = storage.getUserAuth();
    if (!userAuth) return null;
    const userId = create(UserIdSchema, { id: userAuth?.userId });
    const refreshToken = create(RefreshTokenSchema);
    const userRefreshToken = create(UserRefreshTokenSchema, {
      userId: userId,
      refreshToken: refreshToken
    });
    return userRefreshToken;
  },

  clearUserAuth: () => {
    localStorage.removeItem("userAuth");
  },

  saveToken: (inputTokenPair: TokenPair) => {
    try {
      const userId = getUserIdFromAccessToken(inputTokenPair.accessToken);
      storage.setUserAuth({ userId: userId.id, tokenPair: inputTokenPair });
    } catch (error) {
      console.error("save token error: ", error);
    }
    

  }
};
