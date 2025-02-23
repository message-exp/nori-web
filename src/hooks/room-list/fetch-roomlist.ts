import { GetUserRoomList } from "@/api/user/user-service";


export const fetchRoomList = async (userId: bigint) => {
  try {
    const roomlist = await GetUserRoomList(userId);
    return roomlist.rooms;
  } catch (error) {
    console.error("Failed to fetch room list:", error);
  }
};
