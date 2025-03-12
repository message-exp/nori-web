import { createClient } from "@connectrpc/connect";
import { create } from "@bufbuild/protobuf";

import { RoomList } from "@/proto-generated/nori/v0/room/general/room_list_pb";
import { UserIdSchema } from "@/proto-generated/nori/v0/user/user_id_pb";
import { UserNetworkService } from "@/proto-generated/nori/v0/user/network/user_network_service_pb";

import { transport } from "@/api/client";

const client = createClient(UserNetworkService, transport);

export const GetUserRoomList = async (userId: bigint | null | undefined): Promise<RoomList> => {
  if (!userId) {
    throw new Error("userId is null or undefined");
  }
  const request = create(UserIdSchema, { id: userId });
  try {
    const response = await client.getUserRoomList(request);
    console.log("Room list retrieved successfully", response);
    return response;
  } catch (error) {
    console.error("Failed to retrieve room list", error);
    throw error;
  }
};

// Future implementations for contact-related methods can be added here
// export const GetContactList = async (userId: bigint): Promise<ContactList> => {
//   // Implementation when proto definition is ready
// };
