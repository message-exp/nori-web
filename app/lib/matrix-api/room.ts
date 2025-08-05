import { client } from "./client";
import { EventTimeline, type ICreateRoomOpts, type Room } from "matrix-js-sdk";
import { getImageObjectUrl } from "./utils";

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

export async function getRoomAvatar(room: Room | null) {
  if (!room) {
    console.log("room not found");
    return undefined;
  }

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
