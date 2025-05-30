import React, { useEffect, useState } from "react";
import * as sdk from "matrix-js-sdk";
import { Button } from "~/components/ui/button";
import {
  getInvites,
  acceptInvite,
  rejectInvite,
} from "~/lib/matrix-api/invite";
import { client } from "~/lib/matrix-api/client";
import type { Room } from "matrix-js-sdk";

export const InviteList: React.FC = () => {
  const [invites, setInvites] = useState<Room[]>([]);

  // 取目前 invite 的房間
  const refresh = () => {
    setInvites(getInvites());
  };

  useEffect(() => {
    refresh();
    client.client?.on(sdk.ClientEvent.Sync, refresh);
    client.client?.on(sdk.RoomEvent.Timeline, refresh);
    return () => {
      client.client?.removeListener(sdk.ClientEvent.Sync, refresh);
      client.client?.removeListener(sdk.RoomEvent.Timeline, refresh);
    };
  }, []);

  if (invites.length === 0) return null;

  return (
    <div className="p-2 border-b">
      <h3 className="font-medium mb-2">Invitations</h3>
      {invites.map((room) => {
        const me = client.client?.getUserId() || "";
        const ev = room
          .getLiveTimeline()
          .getState(sdk.EventTimeline.FORWARDS)
          ?.getStateEvents("m.room.member", me);
        const inviter = ev?.getSender() ?? "unknown";

        return (
          <div
            key={room.roomId}
            className="flex items-center justify-between mb-1"
          >
            <div className="flex-1">
              <div className="text-sm">{room.name || room.roomId}</div>
              <div className="text-xs text-muted-foreground">
                Invited by {inviter}
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  await acceptInvite(room.roomId);
                  refresh();
                }}
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={async () => {
                  await rejectInvite(room.roomId);
                  refresh();
                }}
              >
                Reject
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
