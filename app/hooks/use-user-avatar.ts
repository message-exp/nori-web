import type { User } from "matrix-js-sdk";
import { useEffect, useState } from "react";
import { getUserAvatar } from "~/lib/matrix-api/user";

/** 依 user 取得 avatar 物件 URL，並自動清理 */
export function useUserAvatar(user: User | null) {
  const [url, setUrl] = useState<string>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let revokeUrl: string | undefined;
    let isCancelled = false;

    if (!user) {
      setUrl(undefined);
      setError(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    (async () => {
      try {
        revokeUrl = await getUserAvatar(user);
        if (!isCancelled) {
          setUrl(revokeUrl);
          setError(undefined);
        }
      } catch (err) {
        if (!isCancelled) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to load user avatar";
          setError(errorMessage);
          setUrl(undefined);
          console.error("Error loading user avatar:", err);
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
  }, [user]);

  return { url, error, isLoading };
}
