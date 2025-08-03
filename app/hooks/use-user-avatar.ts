import type { User } from "matrix-js-sdk";
import { useEffect, useState } from "react";
import { getUserAvatar } from "~/lib/matrix-api/user";

/** 依 user 取得 avatar 物件 URL，並自動清理 */
export function useUserAvatar(user: User | null) {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    let revokeUrl: string | undefined;

    if (!user) {
      setUrl(undefined);
      return;
    }

    (async () => {
      revokeUrl = await getUserAvatar(user); // 您的 async 函式
      setUrl(revokeUrl);
    })();

    return () => {
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [user]);

  return url; // 回傳可直接塞進 <img src={...}>
}
