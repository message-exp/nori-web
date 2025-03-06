import { createClient } from "@connectrpc/connect";
import { create } from "@bufbuild/protobuf";
import { RoomGeneralService } from "@/proto-generated/nori/v0/room/general/room_general_service_pb";
import { Room } from "@/proto-generated/nori/v0/room/room_pb";
import { RoomIdSchema } from "@/proto-generated/nori/v0/room/room_id_pb";
import { RoomUserRequestSchema } from "@/proto-generated/nori/v0/room/room_user_request_pb";
import { RoomCreateRequestSchema } from "@/proto-generated/nori/v0/room/general/room_create_request_pb";
import { RoomBasicInfoRequestSchema } from "@/proto-generated/nori/v0/room/general/room_basic_info_request_pb";
import { RoomBasicInfoResponse } from "@/proto-generated/nori/v0/room/general/room_basic_info_response_pb";
import { UserIdSchema } from "@/proto-generated/nori/v0/user/user_id_pb";
import { transport } from "@/api/client";

const client = createClient(RoomGeneralService, transport);

/**
 * Create a new room
 * @param roomName The name of the new room
 * @param creator The creator's user ID
 * @param invitees An array of user IDs to invite
 * @returns The ID of the created room
 */
export const CreateRoom = async (roomName: string, creator: bigint, invitees: bigint[]): Promise<bigint> => {
  const request = create(RoomCreateRequestSchema, {
    name: roomName,
    creator: create(UserIdSchema, { id: creator }),
    invitees: invitees.map(id => create(UserIdSchema, { id })),
  });

  try {
    const response = await client.createRoom(request);
    console.log("Room created successfully", response);
    return response.id;
  } catch (error) {
    console.error("Failed to create room", error);
    throw error;
  }
};

/**
 * Get room data
 * @param roomId The ID of the room to retrieve
 * @param userId The ID of the user requesting the room
 * @returns The room data
 */
export const GetRoom = async (roomId: bigint, userId: bigint): Promise<Room> => {
  const request = create(RoomUserRequestSchema, {
    roomId: create(RoomIdSchema, { id: roomId }),
    userId: create(UserIdSchema, { id: userId }),
  });

  try {
    const response = await client.getRoom(request);
    console.log("Got room successfully", response);
    return response;
  } catch (error) {
    console.error("Failed to get room", error);
    throw error;
  }
};

/**
 * Get room basic information
 * @param roomId The ID of the room
 * @param userId The ID of the user requesting the information
 * @returns The basic room information
 */
export const GetRoomBasic = async (roomId: bigint, userId: bigint): Promise<RoomBasicInfoResponse> => {
  const request = create(RoomUserRequestSchema, {
    roomId: create(RoomIdSchema, { id: roomId }),
    userId: create(UserIdSchema, { id: userId }),
  });

  try {
    const response = await client.getRoomBasic(request);
    console.log("Got room basic info successfully", response);
    return response;
  } catch (error) {
    console.error("Failed to get room basic info", error);
    throw error;
  }
};

/**
 * Update the basic information of a room
 * @param roomId The ID of the room to update
 * @param sharedName The shared name for the room
 * @param customName The custom name for the room
 * @returns `null`. Throws an error if the request fails.
 */
export const UpdateRoomBasic = async (roomId: bigint, sharedName?: string, customName?: string): Promise<null> => {
  const request = create(RoomBasicInfoRequestSchema, {
    roomId: create(RoomIdSchema, { id: roomId }),
    sharedName: sharedName,
    customName: customName,
  });

  try {
    await client.updateRoomBasic(request);
    return null;
  } catch (error) {
    console.error("Failed to update room basic info", error);
    throw error;
  }
};