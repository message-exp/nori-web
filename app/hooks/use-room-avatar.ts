import type { Room } from "matrix-js-sdk";
import { useEffect, useState } from "react";
import { getRoomAvatar } from "~/lib/matrix-api/room";

/** 依 room 取得 avatar 物件 URL，並自動清理 */
export function useRoomAvatar(room: Room | null) {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    let revokeUrl: string | undefined;

    if (!room) {
      setUrl(undefined);
      return;
    }

    (async () => {
      revokeUrl = await getRoomAvatar(room); // 您的 async 函式
      setUrl(revokeUrl);
    })();

    return () => {
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [room]);

  return url; // 回傳可直接塞進 <img src={...}>
}
