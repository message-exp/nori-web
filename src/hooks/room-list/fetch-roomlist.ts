import { GetUserRoomList } from "@/api/user/user-service";
import { RoomBasicInfoResponse } from "@/proto-generated/nori/v0/room/room_basic_info_response_pb";
import { Dispatch, SetStateAction } from "react";


export const fetchRoomList = async (userId: bigint, setRoomListArray: Dispatch<SetStateAction<RoomBasicInfoResponse[]>>) => {
  try {
    const roomlist = await GetUserRoomList(userId);
    setRoomListArray(roomlist.rooms);
  } catch (error) {
    console.error("Failed to fetch room list:", error);
  }
};
