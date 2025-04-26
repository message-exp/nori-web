import { client } from "./client";
import { EventTimeline, type ICreateRoomOpts, type Room } from "matrix-js-sdk";

export function getRoom(roomId: string | null): Room | null {
  if (!client.client) {
    throw new Error("Matrix client is not initialized");
  }
  if (!roomId) {
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
