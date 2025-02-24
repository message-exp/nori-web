import { GetUser } from "@/api/user/user-service";

export const fetchUsername = async (userId: bigint) => {
  try {
    const user = await GetUser(userId);
    return user.username;
  } catch (error) {
    console.error("Failed to fetch username:", error);
  }
  
};


