import { createClient } from "@connectrpc/connect";
import { create } from "@bufbuild/protobuf";
import { RoomMemberService } from "@/proto-generated/nori/v0/room/member/room_member_service_pb";
import { RoomMemberList } from "@/proto-generated/nori/v0/room/member/room_member_pb";
import { RoomIdSchema } from "@/proto-generated/nori/v0/room/room_id_pb";
import { RoomUserRequestSchema } from "@/proto-generated/nori/v0/room/room_user_request_pb";
import { InviteUserToRoomRequestSchema } from "@/proto-generated/nori/v0/room/member/invite_user_to_room_request_pb";
import { RoomJoinInviteReplySchema } from "@/proto-generated/nori/v0/room/member/room_join_invite_reply_pb";
import { RoomJoinRequestReplySchema } from "@/proto-generated/nori/v0/room/member/room_join_request_reply_pb";
import { UserIdSchema } from "@/proto-generated/nori/v0/user/user_id_pb";
import { transport } from "@/api/client";

const client = createClient(RoomMemberService, transport);

/**
 * Get room member list
 * @param roomId The ID of the room
 * @param userId The ID of the user requesting the member list
 * @returns The list of room members
 */
export const GetRoomMembers = async (roomId: bigint, userId: bigint): Promise<RoomMemberList> => {
  const request = create(RoomUserRequestSchema, {
    roomId: create(RoomIdSchema, { id: roomId }),
    userId: create(UserIdSchema, { id: userId }),
  });

  try {
    const response = await client.getRoomMembers(request);
    console.log("Get room members successfully", response);
    return response;
  } catch (error) {
    console.error("Failed to retrieve room members", error);
    throw error;
  }
};

/**
 * Invite users to a room
 * @param roomId The ID of the room
 * @param inviter The ID of the user inviting
 * @param invitees The IDs of the users to be invited
 * @returns `null`. Throws an error if the request fails.
 */
export const InviteToRoom = async (roomId: bigint, inviter: bigint, invitees: bigint[]): Promise<null> => {
  const request = create(InviteUserToRoomRequestSchema, {
    roomId: create(RoomIdSchema, { id: roomId }),
    inviter: create(UserIdSchema, { id: inviter }),
    invitees: invitees.map(id => create(UserIdSchema, { id })),
  });

  try {
    await client.inviteToRoom(request);
    return null;
  } catch (error) {
    console.error("Failed to invite users to room", error);
    throw error;
  }
};

/**
 * Reply to a room join invitation
 * @param roomId The ID of the room
 * @param accept Whether to accept or decline the invitation
 * @returns `null`. Throws an error if the request fails.
 */
export const InviteRoomReply = async (roomId: bigint, accept: boolean): Promise<null> => {
  const request = create(RoomJoinInviteReplySchema, {
    roomId: create(RoomIdSchema, { id: roomId }),
    accept: accept,
  });

  try {
    await client.inviteRoomReply(request);
    return null;
  } catch (error) {
    console.error("Failed to reply to room invitation", error);
    throw error;
  }
};

/**
 * Request to join a room
 * @param roomId The ID of the room
 * @param userId The ID of the user joining the room
 * @returns `null`. Throws an error if the request fails.
 */
export const JoinRoom = async (roomId: bigint, userId: bigint): Promise<null> => {
  const request = create(RoomUserRequestSchema, {
    roomId: create(RoomIdSchema, { id: roomId }),
    userId: create(UserIdSchema, { id: userId }),
  });

  try {
    await client.joinRoom(request);
    return null;
  } catch (error) {
    console.error("Failed to join room", error);
    throw error;
  }
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
  const request = create(RoomJoinRequestReplySchema, {
    roomId: create(RoomIdSchema, { id: roomId }),
    joiner: create(UserIdSchema, { id: joiner }),
    accept: accept,
    approver: create(UserIdSchema, { id: approver }),
  });

  try {
    await client.joinRoomReply(request);
    return null;
  } catch (error) {
    console.error("Failed to reply to join request", error);
    throw error;
  }
};

/**
 * Leave a room
 * @param roomId The ID of the room
 * @param userId The ID of the user leaving the room
 * @returns `null`. Throws an error if the request fails.
 */
export const LeaveRoom = async (roomId: bigint, userId: bigint): Promise<null> => {
  const request = create(RoomUserRequestSchema, {
    roomId: create(RoomIdSchema, { id: roomId }),
    userId: create(UserIdSchema, { id: userId }),
  });

  try {
    await client.leaveRoom(request);
    return null;
  } catch (error) {
    console.error("Failed to leave room", error);
    throw error;
  }
};