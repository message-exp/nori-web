import { useEffect, useState } from "react";
import { ClientEvent } from "matrix-js-sdk";
import { getDMPartnerUserId } from "~/lib/matrix-api/room";
import { getUser } from "~/lib/matrix-api/user";
import { client } from "~/lib/matrix-api/client";
import type { PlatformEnum } from "~/lib/contacts-server-api/types";

interface RoomConfigInput {
  roomId: string;
  platform: PlatformEnum;
  platformUserId: string;
}

interface RoomConfigWithName extends RoomConfigInput {
  platformUserName?: string;
}

/**
 * Hook to enrich room configs with display names from Matrix
 * @param roomConfigs Array of room configurations
 * @returns Array of room configurations with display names
 */
export function useRoomConfigsWithNames(
  roomConfigs: RoomConfigInput[],
): RoomConfigWithName[] {
  const [configs, setConfigs] = useState<RoomConfigWithName[]>([]);

  useEffect(() => {
    const updateConfigs = () => {
      const enrichedConfigs = roomConfigs.map((config) => {
        const userId = getDMPartnerUserId(config.roomId);
        let displayName: string | undefined;

        if (userId) {
          const user = getUser(userId);
          displayName = user?.displayName || undefined;
        }

        return {
          ...config,
          platformUserName: displayName,
        };
      });

      setConfigs(enrichedConfigs);
    };

    // Initial fetch
    updateConfigs();

    // Listen for sync state changes (when client syncs and user data becomes available)
    const handleSync = () => {
      updateConfigs();
    };

    // Listen for account data changes (when user profiles update)
    const handleAccountData = () => {
      updateConfigs();
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
  }, [roomConfigs]);

  return configs;
}
