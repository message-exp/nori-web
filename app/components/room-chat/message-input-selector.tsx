import { useEffect, useState } from "react";
import { ClientEvent } from "matrix-js-sdk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { BridgeIcon } from "~/components/ui/bridge-icon";
import { client } from "~/lib/matrix-api/client";
import { getRoom, getDMPartnerUserId } from "~/lib/matrix-api/room";
import { getUser } from "~/lib/matrix-api/user";
import { detectPlatform } from "~/lib/matrix-api/utils";
import type { PlatformEnum } from "~/lib/contacts-server-api/types";
import {
  getPlatformBgColor,
  getPlatformDisplayName,
} from "~/lib/platform-styles";

interface RoomInfo {
  roomId: string;
  platform: PlatformEnum;
  platformUserName?: string;
}

interface MessageInputSelectorProps {
  roomIds: string[];
  selectedRoomId: string;
  onRoomChange: (roomId: string) => void;
}

export function MessageInputSelector({
  roomIds,
  selectedRoomId,
  onRoomChange,
}: Readonly<MessageInputSelectorProps>) {
  const [roomInfos, setRoomInfos] = useState<RoomInfo[]>([]);

  useEffect(() => {
    const updateRoomInfos = () => {
      const infos = roomIds
        .map((roomId): RoomInfo | null => {
          const room = getRoom(roomId);
          if (!room) return null;

          const platform = detectPlatform(room);
          const userId = getDMPartnerUserId(roomId);
          let displayName: string | undefined;

          if (userId) {
            const user = getUser(userId);
            displayName = user?.displayName || undefined;
          }

          return {
            roomId,
            platform,
            platformUserName: displayName,
          };
        })
        .filter((info): info is RoomInfo => info !== null);

      setRoomInfos(infos);
    };

    // Initial fetch
    updateRoomInfos();

    // Listen for sync state changes
    const handleSync = () => {
      updateRoomInfos();
    };

    // Listen for account data changes
    const handleAccountData = () => {
      updateRoomInfos();
    };

    if (client.client) {
      client.client.on(ClientEvent.Sync, handleSync);
      client.client.on(ClientEvent.AccountData, handleAccountData);
    }

    return () => {
      if (client.client) {
        client.client.off(ClientEvent.Sync, handleSync);
        client.client.off(ClientEvent.AccountData, handleAccountData);
      }
    };
  }, [roomIds]);

  // Only show selector if multiple rooms exist
  if (roomInfos.length <= 1) {
    return null;
  }

  // Get current selected room info
  const selectedInfo = roomInfos.find((info) => info.roomId === selectedRoomId);

  if (!selectedInfo) {
    return null;
  }

  return (
    <Select value={selectedRoomId} onValueChange={onRoomChange}>
      <SelectTrigger className="w-fit min-w-[180px]">
        <SelectValue>
          <div className="flex items-center gap-2">
            <div
              className={`size-5 ${getPlatformBgColor(selectedInfo.platform)} rounded-full flex items-center justify-center`}
            >
              <BridgeIcon
                platform={selectedInfo.platform}
                className="size-3 text-white"
                showMatrix={true}
              />
            </div>
            <span className="flex items-center gap-1.5">
              <span>{getPlatformDisplayName(selectedInfo.platform)}</span>
              {selectedInfo.platformUserName && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">
                    {selectedInfo.platformUserName}
                  </span>
                </>
              )}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {roomInfos.map((info) => (
          <SelectItem key={info.roomId} value={info.roomId}>
            <div className="flex items-center gap-2">
              <div
                className={`size-5 ${getPlatformBgColor(info.platform)} rounded-full flex items-center justify-center`}
              >
                <BridgeIcon
                  platform={info.platform}
                  className="size-3 text-white"
                  showMatrix={true}
                />
              </div>
              <span className="flex items-center gap-1.5">
                <span>{getPlatformDisplayName(info.platform)}</span>
                {info.platformUserName && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      {info.platformUserName}
                    </span>
                  </>
                )}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
