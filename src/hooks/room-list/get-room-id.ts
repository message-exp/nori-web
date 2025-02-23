import { RoomBasicInfoResponse } from "@/proto-generated/nori/v0/room/room_basic_info_response_pb";


export const getRoomId = (room: RoomBasicInfoResponse): bigint => {
  if (!room.roomId) {
    throw new Error("Room ID is undefined");
  }
  return room.roomId.id;
};