import { TokenPair } from "@/proto-generated/nori/v0/user/token_pair_pb";

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
    const data = JSON.parse(userAuth);
    return { userId: BigInt(data.userId), tokenPair: data.tokenPair };
  },
  clearUserAuth: () => {
    localStorage.removeItem("userAuth");
  },
};
