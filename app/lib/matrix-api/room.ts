import { client } from "./client";
import { EventTimeline, type ICreateRoomOpts, type Room } from "matrix-js-sdk";
import { getImageObjectUrl } from "./utils";
import { getUserAvatar, getUser } from "./user";

export function getRoom(roomId: string | null): Room | null {
  if (!client.client) {
    throw new Error("Matrix client is not initialized");
  }
  if (!roomId) {
    console.error("room id is not valid");
    return null;
  }
  return client.client.getRoom(roomId);
}

export async function createRoom(
  options: ICreateRoomOpts,
): Promise<{ room_id: string }> {
  if (!client.client) {
    throw new Error("Matrix client is not initialized");
  }
  return await client.client.createRoom(options);
}

export async function updateRoom(roomId: string, title: string, topic: string) {
  if (!client.client) {
    throw new Error("Matrix client is not initialized");
  }

  // Update room name (title)
  await client.client.setRoomName(roomId, title);

  // Update room topic
  await client.client.setRoomTopic(roomId, topic);
}

export function getRoomTopic(room: Room): string | null {
  if (!room) {
    return null;
  }
  const roomCurrentState = room
    .getLiveTimeline()
    .getState(EventTimeline.FORWARDS);
  const topicEvent = roomCurrentState?.getStateEvents("m.room.topic", "");
  return topicEvent ? topicEvent.getContent().topic : null;
}

export async function inviteToRoom(
  roomId: string,
  userId: string,
  reason?: string,
) {
  if (!client.client) {
    throw new Error("Matrix client is not initialized");
  }
  const ret_message = await client.client.invite(roomId, userId, reason);
  return ret_message;
}

export async function leaveRoom(roomId: string): Promise<void> {
  if (!client.client) {
    throw new Error("Matrix client is not initialized");
  }

  try {
    await client.client.leave(roomId);
    console.log(`Successfully left room: ${roomId}`);
  } catch (error) {
    console.error(`Failed to leave room ${roomId}:`, error);
    throw new Error(`Failed to leave room: ${error}`);
  }
}

export function isDMRoom(room: Room | null): boolean {
  if (!room || !client.client) {
    return false;
  }

  const members = room.getJoinedMembers();
  const memberCount = members.length;

  // DM room should have exactly 2 members
  if (memberCount !== 2) {
    return false;
  }

  // Check if room is marked as direct
  const currentUserId = client.client.getUserId();
  if (!currentUserId) {
    return false;
  }

  // Get the m.direct event from account data to check if this room is a DM
  const directRooms =
    client.client.getAccountData("m.direct" as any)?.getContent() || {};

  // Check if this room is in any user's direct room list
  for (const userId in directRooms) {
    const roomIds = directRooms[userId];
    if (Array.isArray(roomIds) && roomIds.includes(room.roomId)) {
      return true;
    }
  }

  return false;
}

export async function getRoomAvatar(room: Room | null) {
  if (!room) {
    console.log("room not found");
    return undefined;
  }

  // Check if this is a DM room, if so use the other user's avatar
  if (isDMRoom(room) && client.client) {
    const currentUserId = client.client.getUserId();
    const members = room.getJoinedMembers();

    // Find the other user (not the current user)
    const otherUser = members.find((member) => member.userId !== currentUserId);

    if (otherUser) {
      const user = getUser(otherUser.userId);
      const userAvatar = await getUserAvatar(user);
      if (userAvatar) {
        console.log("Using other user's avatar for DM room");
        return userAvatar;
      }
    }
  }

  // Fall back to room avatar if not a DM or user avatar not found
  const state = room.getLiveTimeline().getState(EventTimeline.FORWARDS);
  if (!state) {
    console.log("room state not found");
    return undefined;
  }

  const avatarEvent = state.getStateEvents("m.room.avatar", "");
  const mxcUrl = avatarEvent?.getContent()?.url;

  if (!mxcUrl) {
    console.log("room avatar not found");
    return undefined;
  }

  const returnUrl = await getImageObjectUrl(mxcUrl);
  console.log("return url: ", returnUrl);
  return returnUrl;
}
