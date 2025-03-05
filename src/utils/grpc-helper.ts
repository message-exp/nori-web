import { RoomBasicInfoResponse } from "@/proto-generated/nori/v0/room/room_basic_info_response_pb";
import { storage } from "./storage/user-storage";
import { CreateRoom } from "@/api/room/room-service";


export const getRoomId = (room: RoomBasicInfoResponse): bigint => {
  if (!room.roomId) {
    throw new Error("Room ID is undefined");
  }
  return room.roomId.id;
};

export const addRoom = async (addRoomName : string) => {
  const userId = storage.getUserId();
  if (!userId) {
    throw new Error("User ID is not available");
  }
  const newRoomId = await CreateRoom(addRoomName, userId, []);
  console.log("new room id: ", newRoomId);
  return newRoomId;
}; 