import { useEffect, useState } from "react";
import { getRoomList } from "@/lib/matrix-api/room-list";
import { ClientEvent, Room } from "matrix-js-sdk";
import { client } from "@/lib/matrix-api/client";

export function useRoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const matrixRooms = await getRoomList();
        setRooms(matrixRooms);
      } catch (e) {
        console.error("取得房間列表失敗", e);
      }
    }

    // initial load
    fetchRooms();

    // Listen for new messages
    client.client.on(ClientEvent.Room, fetchRooms);

    return () => {
      client.client.removeListener(ClientEvent.Room, fetchRooms);
    };
  }, []);

  return rooms;
}
