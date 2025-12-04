import { client } from "./client";
import {
  EventTimeline,
  type ICreateRoomOpts,
  type Room,
  type AccountDataEvents,
} from "matrix-js-sdk";
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

  const roomName = room.name || room.roomId;

  const currentUserId = client.client.getUserId();
  if (!currentUserId) {
    return false;
  }

  // Method 1: Check m.direct account data first (most reliable)
  const directRooms =
    client.client
      .getAccountData("m.direct" as keyof AccountDataEvents)
      ?.getContent() || {};

  for (const userId in directRooms) {
    const roomIds = directRooms[userId];
    if (Array.isArray(roomIds) && roomIds.includes(room.roomId)) {
      return true;
    }
  }

  // Method 2: Check for is_direct flag in member events (Element's approach)
  const members = room.getJoinedMembers();
  const memberCount = members.length;

  // Check if any member has is_direct flag set
  for (const member of members) {
    try {
      const memberEvent = member.events?.member;
      if (memberEvent?.event) {
        const isDirectCurrent = memberEvent.event.content?.is_direct;
        const isDirectPrev =
          memberEvent.event.unsigned?.prev_content?.is_direct;

        if (isDirectCurrent || isDirectPrev) {
          return true;
        }
      }
    } catch (error) {
      console.error(
        `isDMRoom: Error checking is_direct flag for member ${member.userId}:`,
        error,
      );
    }
  }

  // Method 3: Check using getDMInviter if available (newer SDK versions)
  try {
    const myMember = room.getMember(currentUserId);
    if (myMember && typeof myMember.getDMInviter === "function") {
      const dmInviter = myMember.getDMInviter();
      if (dmInviter) {
        return true;
      }
    }
  } catch (error) {
    console.error(`isDMRoom: Error checking getDMInviter:`, error);
  }

  return false;
}

/**
 * Get the other user's Matrix user ID in a DM room
 * @param roomId The room ID
 * @returns The other user's Matrix user ID, or null if not found
 */
export function getDMPartnerUserId(roomId: string): string | null {
  if (!client.client) {
    console.error("Matrix client is not initialized");
    return null;
  }

  const room = getRoom(roomId);
  if (!room) {
    console.error(`Room ${roomId} not found`);
    return null;
  }

  const currentUserId = client.client.getUserId();
  if (!currentUserId) {
    console.error("Current user ID not found");
    return null;
  }

  const members = room.getJoinedMembers();

  // Find the other user (not the current user)
  const otherUser = members.find((member) => member.userId !== currentUserId);

  return otherUser?.userId || null;
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
