import { RoomBasicInfoResponse } from "@/proto-generated/nori/v0/room/room_basic_info_response_pb";

export const getRoomName = (room: RoomBasicInfoResponse): string => {
  if (room.name.case === "sharedName" || room.name.case === "customName") {
    return room.name.value;
  } else {
    return "";
  }
};
