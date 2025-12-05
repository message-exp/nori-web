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

interface InviteListProps {
  onInviteCountChange?: (count: number) => void;
}

export const InviteList: React.FC<InviteListProps> = ({
  onInviteCountChange,
}) => {
  const [invites, setInvites] = useState<Room[]>([]);

  // 取目前 invite 的房間
  const refresh = () => {
    const currentInvites = getInvites();
    setInvites(currentInvites);
    onInviteCountChange?.(currentInvites.length);
  };

  useEffect(() => {
    refresh();

    client.client?.on(sdk.ClientEvent.Sync, refresh);
    client.client?.on(sdk.RoomEvent.Timeline, refresh);
    client.client?.on(sdk.RoomMemberEvent.Membership, refresh);
    return () => {
      client.client?.removeListener(sdk.ClientEvent.Sync, refresh);
      client.client?.removeListener(sdk.RoomEvent.Timeline, refresh);
      client.client?.removeListener(sdk.RoomMemberEvent.Membership, refresh);
    };
  }, []);

  if (invites.length === 0) return null;

  return (
    <div className="p-2">
      <h3 className="text-sm font-semibold px-2 py-2 text-muted-foreground">
        Invitations
      </h3>
      <div className="flex flex-col gap-2">
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
              className="flex flex-col gap-2 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {room.name || room.roomId}
                </div>
                <div className="text-xs text-muted-foreground">
                  Invited by {inviter}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  className="flex-1"
                  onClick={async () => {
                    await acceptInvite(room.roomId);
                    refresh();
                  }}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={async () => {
                    await rejectInvite(room.roomId);
                    refresh();
                  }}
                >
                  Decline
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
