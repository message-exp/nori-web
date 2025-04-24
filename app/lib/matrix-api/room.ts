import { client } from "./client";
import type { Room } from "matrix-js-sdk";

export function getRoom(roomId: string | null): Room | null {
  if (!client.client) {
    throw new Error("Matrix client is not initialized");
  }
  if (!roomId) {
    return null;
  }
  return client.client.getRoom(roomId);
}
