import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { avatarFallback } from "~/lib/utils";
import { useRoomAvatar } from "~/hooks/use-room-avatar";
import { getRoom } from "~/lib/matrix-api/room";

interface RoomAvatarProps {
  roomId: string;
  roomName: string;
  fallbackAvatarUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
  alt?: string;
}

/**
 * Room avatar component that uses the useRoomAvatar hook to fetch and display room avatars
 * with proper fallback handling and memory management
 */
export function RoomAvatar({
  roomId,
  roomName,
  fallbackAvatarUrl,
  className,
  fallbackClassName = "text-sm",
  alt,
}: Readonly<RoomAvatarProps>) {
  const matrixRoom = useMemo(() => getRoom(roomId), [roomId]);
  const { url: roomAvatarUrl } = useRoomAvatar(matrixRoom);

  return (
    <Avatar className={className}>
      <AvatarImage
        src={roomAvatarUrl || fallbackAvatarUrl || undefined}
        alt={alt || roomName}
      />
      <AvatarFallback className={fallbackClassName}>
        {avatarFallback(roomName)}
      </AvatarFallback>
    </Avatar>
  );
}
