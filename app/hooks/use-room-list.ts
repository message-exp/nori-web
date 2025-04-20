import { useEffect, useState } from "react";
import { getRoomList } from "~/lib/matrix-api/room-list";
import type { Chat } from "~/lib/example";
import { getRoomAvatar } from "~/lib/matrix-api/utils";
import { client } from "~/lib/matrix-api/client";
import { NotificationCountType } from "matrix-js-sdk";

export function useRoomList() {
  const [rooms, setRooms] = useState<Chat[]>([]);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const matrixRooms = await getRoomList();
        const mappedRooms = matrixRooms.map((room) => ({
          id: room.roomId,
          name: room.name ?? room.getCanonicalAlias() ?? "Unnamed",
          avatar: getRoomAvatar(room, client.client.baseUrl) ?? undefined,
          lastMessage: "TODO: 填入摘要", // 先留空等你補
          time: "剛剛", // 或用 timestamp 轉文字
          unread:
            room.getUnreadNotificationCount?.(NotificationCountType.Total) ?? 0,
          online: room.getMyMembership?.() === "join",
        }));
        setRooms(mappedRooms);
      } catch (e) {
        console.error("取得房間列表失敗", e);
      }
    }

    fetchRooms();
  }, []);

  return rooms;
}
