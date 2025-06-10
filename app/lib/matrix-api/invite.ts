import type { Room } from "matrix-js-sdk";
import { client } from "./client";

export function getInvites(): Room[] {
  if (!client.client) throw new Error("Matrix client is not initialized");
  return client.client
    .getRooms()
    .filter((r) => r.getMyMembership() === "invite");
}

export async function acceptInvite(roomId: string): Promise<void> {
  if (!client.client) throw new Error("Matrix client is not initialized");
  await client.client.joinRoom(roomId);
}

export async function rejectInvite(roomId: string): Promise<void> {
  if (!client.client) throw new Error("Matrix client is not initialized");
  await client.client.leave(roomId);
}
