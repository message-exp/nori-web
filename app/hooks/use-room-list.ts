import { useEffect, useState } from "react";
import { getRoomList } from "~/lib/matrix-api/room-list";
import { ClientEvent, Room, RoomEvent } from "matrix-js-sdk";
import { client } from "~/lib/matrix-api/client";
import { join } from "path";

export function useRoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const matrixRooms = await getRoomList();
        const joinedRooms = matrixRooms.filter(
          (room) => room.getMyMembership() === "join",
        );
        setRooms(joinedRooms);
      } catch (e) {
        console.error("取得房間列表失敗", e);
      }
    }

    // initial load
    fetchRooms();

    // Listen for new messages
    client.client.on(ClientEvent.Room, fetchRooms);
    client.client.on(RoomEvent.MyMembership, fetchRooms);

    return () => {
      client.client.removeListener(ClientEvent.Room, fetchRooms);
      client.client.removeListener(RoomEvent.MyMembership, fetchRooms);
    };
  }, []);

  return rooms;
}
