import { client } from "./client";
import type { Room } from "matrix-js-sdk";

export async function getRoomList(): Promise<Room[]> {
  if (!client.client) {
    throw new Error("Matrix client is not initialized");
  }

  const allRooms = client.client.getRooms();

  console.log("All room: ", allRooms);

  // only kepp "normal text room", remove spaces / threads and other special room types
  const filteredRooms = allRooms.filter((room) => {
    const type = room.getType();
    return !type; // only keep default room type (not including m.space)
  });

  return filteredRooms;
}
