import { createClient, Code, ConnectError } from "@connectrpc/connect";
import { create } from "@bufbuild/protobuf";
import { RoomService } from "@/proto-generated/nori/v0/room/room_service_pb";
// import { Empty } from "@bufbuild/protobuf/wkt";
import { Room } from "@/proto-generated/nori/v0/room/room_pb";
import { RoomIdSchema } from "@/proto-generated/nori/v0/room/room_id_pb";
import { RoomCreateRequestSchema } from "@/proto-generated/nori/v0/room/room_create_request_pb";
import { RoomUserRequestSchema } from "@/proto-generated/nori/v0/room/room_user_request_pb";
import { RoomBasicInfoRequestSchema } from "@/proto-generated/nori/v0/room/room_basic_info_request_pb";
import { InviteUserToRoomRequestSchema } from "@/proto-generated/nori/v0/room/invite_user_to_room_request_pb";
import { RoomJoinInviteReplySchema } from "@/proto-generated/nori/v0/room/room_join_invite_reply_pb";
import { RoomJoinRequestReplySchema } from "@/proto-generated/nori/v0/room/room_join_request_reply_pb";
import { UserIdSchema } from "@/proto-generated/nori/v0/user/user_id_pb";
import { transport } from "@/api/client";


const client = createClient(RoomService, transport);


/**
 * Create a new room
 * @param roomName The name of the new room
 * @param creator The creator's user ID
 * @param invitees An array of user IDs to invite
 * @returns The ID of the created room
 */
export const CreateRoom = async (roomName: string, creator: bigint, invitees: bigint[]): Promise<bigint> => {
  // prepare the request
  const accessToken = "";  // TODO: get access token
  const request = create(RoomCreateRequestSchema, {
    name: roomName,
    creator: create(UserIdSchema, {
      id: creator
    }),
    invitees: invitees.map(id => create(UserIdSchema, { id })),
  });
  let response;

  // send the request
  try {
    response = await client.createRoom(request, { headers: { authorization: accessToken } });
  } catch (error) {
    if (error instanceof ConnectError) {
      const errorCode = error.code;
      console.error("Error Code:", errorCode);
      // console.error("Error Code Message:", error.message);
      // console.error("Error Detail:", error.details);

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
  return response.id;
};


/**
 * Get room data
 * @param roomId The ID of the room to retrieve
 * @param userId The ID of the user requesting the room
 * @returns The room data
 */
export const GetRoom = async (roomId: bigint, userId: bigint): Promise<Room> => {
  // prepare the request
  const accessToken = "";  // TODO: get access token
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
    response = await client.getRoom(request, { headers: { authorization: accessToken } });
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


/**
 * Update the basic information of a room
 * @param roomId The ID of the room to update
 * @param sharedName The shared name for the room
 * @param customName The custom name for the room
 * @returns `null`. Throws an error if the request fails.
 */
export const UpdateRoomBasic = async (roomId: bigint, sharedName?: string, customName?: string): Promise<null> => {
  // prepare the request
  const accessToken = "";  // TODO: get access token
  const request = create(RoomBasicInfoRequestSchema, {
    roomId: create(RoomIdSchema, {
      id: roomId
    }),
    sharedName: sharedName,
    customName: customName,
  });

  // send the request
  try {
    await client.updateRoomBasic(request, { headers: { authorization: accessToken } });
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
  return null;
};


/**
 * Invite users to a room
 * @param roomId The ID of the room to invite users to
 * @param inviter The ID of the user inviting
 * @param invitees The IDs of the users to be invited
 * @returns `null`. Throws an error if the request fails.
 */
export const InviteToRoom = async (roomId: bigint, inviter: bigint, invitees: bigint[]): Promise<null> => {
  // prepare the request
  const accessToken = "";  // TODO: get access token
  const request = create(InviteUserToRoomRequestSchema, {
    roomId: create(RoomIdSchema, {
      id: roomId
    }),
    inviter: create(UserIdSchema, {
      id: inviter
    }),
    invitees: invitees.map(id => create(UserIdSchema, { id })),
  });

  // send the request
  try {
    await client.inviteToRoom(request, { headers: { authorization: accessToken } });
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
  return null;
};


/**
 * Reply to a room join invitation
 * @param roomId The ID of the room
 * @param accept Whether to accept or decline the invitation
 * @returns `null`. Throws an error if the request fails.
 */
export const InviteRoomReply = async (roomId: bigint, accept: boolean): Promise<null> => {
  // prepare the request
  const accessToken = "";  // TODO: get access token
  const request = create(RoomJoinInviteReplySchema, {
    roomId: create(RoomIdSchema, {
      id: roomId
    }),
    accept: accept,
  });

  // send the request
  try {
    await client.inviteRoomReply(request, { headers: { authorization: accessToken } });
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
  return null;
};


/**
 * Request to join a room
 * @param roomId The ID of the room
 * @param userId The ID of the user joining the room
 * @returns `null`. Throws an error if the request fails.
 */
export const JoinRoom = async (roomId: bigint, userId: bigint): Promise<null> => {
  // prepare the request
  const accessToken = "";  // TODO: get access token
  const request = create(RoomUserRequestSchema, {
    roomId: create(RoomIdSchema, {
      id: roomId
    }),
    userId: create(UserIdSchema, {
      id: userId
    }),
  });

  // send the request
  try {
    await client.joinRoom(request, { headers: { authorization: accessToken } });
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
  return null;
};


/**
 * Reply to a room join request
 * @param roomId The ID of the room
 * @param joiner The ID of the user joining the room
 * @param accept Whether to accept or decline the request
 * @param approver The ID of the user approving the request
 * @returns `null`. Throws an error if the request fails.
 */
export const JoinRoomReply = async (roomId: bigint, joiner: bigint, accept: boolean, approver: bigint): Promise<null> => {
  // prepare the request
  const accessToken = "";  // TODO: get access token
  const request = create(RoomJoinRequestReplySchema, {
    roomId: create(RoomIdSchema, {
      id: roomId
    }),
    joiner: create(UserIdSchema, {
      id: joiner
    }),
    accept: accept,
    approver: create(UserIdSchema, {
      id: approver
    }),
  });

  // send the request
  try {
    await client.joinRoomReply(request, { headers: { authorization: accessToken } });
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
  return null;
};


/**
 * Leave a room
 * @param roomId The ID of the room
 * @param userId The ID of the user leaving the room
 * @returns `null`. Throws an error if the request fails.
 */
export const LeaveRoom = async (roomId: bigint, userId: bigint): Promise<null> => {
  // prepare the request
  const accessToken = "";  // TODO: get access token
  const request = create(RoomUserRequestSchema, {
    roomId: create(RoomIdSchema, {
      id: roomId
    }),
    userId: create(UserIdSchema, {
      id: userId
    }),
  });

  // send the request
  try {
    await client.leaveRoom(request, { headers: { authorization: accessToken } });
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
  return null;
};
