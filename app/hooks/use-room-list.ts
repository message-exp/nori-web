import { useEffect, useState } from "react";
import { getRoomList } from "~/lib/matrix-api/room-list";
import { Room } from "matrix-js-sdk";

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

    fetchRooms();
  }, []);

  return rooms;
}
