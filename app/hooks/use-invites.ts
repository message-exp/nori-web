import { useCallback, useEffect, useState } from "react";
import * as sdk from "matrix-js-sdk";
import { client } from "~/lib/matrix-api/client";
import { getInvites } from "~/lib/matrix-api/invite";

export function useInvites() {
  const [invites, setInvites] = useState<sdk.Room[]>([]);

  const refresh = useCallback(() => {
    setInvites(getInvites());
  }, []);

  useEffect(() => {
    refresh();
    client.client?.on(sdk.ClientEvent.Sync, refresh);
    client.client?.on(sdk.RoomEvent.Timeline, refresh);
    return () => {
      client.client?.removeListener(sdk.ClientEvent.Sync, refresh);
      client.client?.removeListener(sdk.RoomEvent.Timeline, refresh);
    };
  }, [refresh]);

  return { invites, refresh };
}
