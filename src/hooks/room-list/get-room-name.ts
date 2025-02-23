import { RoomBasicInfoResponse } from "@/proto-generated/nori/v0/room/room_basic_info_response_pb";


export const getRoomName = (room: RoomBasicInfoResponse): string => {
  return room.name.case === "sharedName" ? room.name.value :
    room.name.case === "customName" ? room.name.value : "";
};