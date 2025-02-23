import { GetUser } from "@/api/user/user-service";

import { Dispatch, SetStateAction } from "react";

export const fetchUsername = async (userId: bigint, setUsername: Dispatch<SetStateAction<string>>) => {
  try {
    const user = await GetUser(userId);
    setUsername(user.username);
  } catch (error) {
    console.error("Failed to fetch username:", error);
  }
};


