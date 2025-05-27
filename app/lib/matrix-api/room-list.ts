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
    return room.getMyMembership() === "join" && !room.getType();
  });

  return filteredRooms;
}
