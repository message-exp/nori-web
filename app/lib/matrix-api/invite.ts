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
  // await client.sync(); //在接受後刷新一次room list
}

export async function rejectInvite(roomId: string): Promise<void> {
  if (!client.client) throw new Error("Matrix client is not initialized");
  await client.client.leave(roomId);
  // await client.sync();
}
