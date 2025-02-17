import { TokenPair } from "@/proto-generated/nori/v0/user/token_pair_pb";

interface UserAuth {
    userId: number;
    tokenpair: TokenPair;
}

export const storage = {
    setUserAuth: (data: UserAuth) => {
        localStorage.setItem("userAuth", JSON.stringify(data));
    },

    getUserAuth: (): UserAuth | null => {
        const data = localStorage.getItem("userAuth");
        return data ? JSON.parse(data) : null;
    },

    clearUserAuth: () => {
        localStorage.removeItem("userAuth");
    }
};