import type { Room } from "matrix-js-sdk";
import { client } from "~/lib/matrix-api/client";
import type { PlatformEnum } from "~/lib/contacts-server-api/types";
import { detectPlatform } from "~/lib/matrix-api/utils";

export interface DMRoomInfo {
  roomId: string;
  roomName: string;
  roomAvatar?: string;
  platform: PlatformEnum;
  platformUserId?: string;
  otherUserId?: string;
}

/**
 * Check if a room is a DM room (2 members only)
 */
export function isDMRoom(room: Room): boolean {
  const members = room.getJoinedMembers();
  return members.length === 2;
}

/**
 * Get the other user's ID in a DM room
 */
export function getOtherUserId(room: Room): string | undefined {
  if (!isDMRoom(room)) return undefined;

  const myUserId = client.client?.getUserId();
  if (!myUserId) return undefined;

  const members = room.getJoinedMembers();
  const otherMember = members.find((member) => member.userId !== myUserId);
  return otherMember?.userId;
}

/**
 * Parse platform user ID from Matrix user ID
 * Format: {platform}_{platform_user_id}:{host_name}
 */
export function parsePlatformUserId(
  matrixUserId: string,
  platform: PlatformEnum,
): string {
  if (platform === "Matrix") {
    return matrixUserId;
  }

  // Extract the local part before the colon
  const localPart = matrixUserId.split(":")[0];
  if (localPart.startsWith("@")) {
    const withoutAt = localPart.substring(1);

    // For bridged users, format is usually platform_userid
    const platformPrefix = platform.toLowerCase() + "_";
    if (withoutAt.startsWith(platformPrefix)) {
      return withoutAt.substring(platformPrefix.length);
    }

    // Fallback: return the whole local part without @
    return withoutAt;
  }

  return matrixUserId;
}

/**
 * Get all DM rooms with their platform information
 */
export function getDMRooms(rooms: Room[]): DMRoomInfo[] {
  return rooms
    .filter((room) => isDMRoom(room))
    .map((room) => {
      const platform = detectPlatform(room);
      const otherUserId = getOtherUserId(room);
      const platformUserId = otherUserId
        ? parsePlatformUserId(otherUserId, platform)
        : undefined;

      return {
        roomId: room.roomId,
        roomName: room.name || `DM with ${otherUserId || "Unknown"}`,
        roomAvatar:
          room.getAvatarUrl(room.client.baseUrl, 64, 64, "crop") || undefined,
        platform,
        platformUserId,
        otherUserId,
      };
    });
}
