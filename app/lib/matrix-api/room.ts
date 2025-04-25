import { client } from "./client";
import type { ICreateRoomOpts, Room } from "matrix-js-sdk";

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
