import { client } from "./client";
import { ClientEvent, type Room } from "matrix-js-sdk";

export async function getRoomList(): Promise<Room[]> {
  if (!client.client) {
    throw new Error("Matrix client is not initialized");
  }

  // await client.sync()

  const allRooms = client.client.getRooms();

  console.log("All room: ", allRooms);

  // 僅保留「普通房間」：不是 Space、Thread 等特殊房型
  const filteredRooms = allRooms.filter((room) => {
    const type = room.getType(); // 如果是 m.space 等會被排除
    return !type;
  });

  return filteredRooms;
}
