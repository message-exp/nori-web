import type { Room } from "matrix-js-sdk";
import { useEffect, useState } from "react";
import { getRoomAvatar } from "~/lib/matrix-api/room";

/** 依 room 取得 avatar 物件 URL，並自動清理 */
export function useRoomAvatar(room: Room | null) {
  const [url, setUrl] = useState<string>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let revokeUrl: string | undefined;
    let isCancelled = false;

    if (!room) {
      setUrl(undefined);
      setError(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    (async () => {
      try {
        revokeUrl = await getRoomAvatar(room);
        if (!isCancelled) {
          setUrl(revokeUrl);
          setError(undefined);
        }
      } catch (err) {
        if (!isCancelled) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to load room avatar";
          setError(errorMessage);
          setUrl(undefined);
          console.error("Error loading room avatar:", err);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isCancelled = true;
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [room]);

  return { url, error, isLoading };
}
