import { Code, ConnectError, createClient } from "@connectrpc/connect";
import { transport } from "../client";
import { RoomBasicInfoResponse } from "@/proto-generated/nori/v0/room/room_basic_info_response_pb";
import { create } from "@bufbuild/protobuf";
import { RoomUserRequestSchema } from "@/proto-generated/nori/v0/room/room_user_request_pb";
import { RoomIdSchema } from "@/proto-generated/nori/v0/room/room_id_pb";
import { UserIdSchema } from "@/proto-generated/nori/v0/user/user_id_pb";
import { RoomGeneralService } from "@/proto-generated/nori/v0/room/general/room_general_service_pb";


const client = createClient(RoomGeneralService, transport);

export const GetRoomBasic = async (roomId: bigint, userId: bigint): Promise<RoomBasicInfoResponse> => {
  // prepare the request
  const request = create(RoomUserRequestSchema, {
    roomId: create(RoomIdSchema, {
      id: roomId
    }),
    userId: create(UserIdSchema, {
      id: userId
    }),
  });
  let response;

  // send the request
  try {
    response = await client.getRoomBasic(request);
  } catch (error) {
    if (error instanceof ConnectError) {
      const errorCode = error.code;
      if (errorCode === Code.Unauthenticated) {
        // TODO: get a new access token and retry
      } else if (errorCode === Code.PermissionDenied) {
        // TODO: handle permission denied case
      }
    }
    // other error
    console.error("Unexpected error when trying to retrieve room list", error);
    throw error;
  }

  // process the response and return
  return response;
};