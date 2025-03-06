import { TokenPair } from "@/proto-generated/nori/v0/user/token_pair_pb";
import { getUserIdFromAccessToken } from "../jwt";

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

  saveToken: (inputTokenPair: TokenPair) => {
    try {
      const userId = getUserIdFromAccessToken(inputTokenPair.accessToken);
      storage.setUserAuth({ userId: userId.id, tokenPair: inputTokenPair });
    } catch (error) {
      console.error("save token error: ", error);
    }
    

  }
};
