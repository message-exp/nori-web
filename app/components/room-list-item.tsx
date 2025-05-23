import { NotificationCountType, Room } from "matrix-js-sdk";
import React from "react";
import { useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useRoomContext } from "~/contexts/room-context";
import { getRoomAvatar } from "~/lib/matrix-api/utils";
import { cn, getLatestMessageText } from "~/lib/utils";
import { Skeleton } from "~/components/ui/skeleton";

interface RoomListProps {
  readonly room: Room;
}

export const RoomListItem = React.memo(({ room }: RoomListProps) => {
  const { selectedRoomId, setSelectedRoomId } = useRoomContext();
  const navigate = useNavigate();

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
    navigate(`/home/${roomId}`);
  };

  return (
    <button
      className={cn(
        "flex items-center gap-3 rounded-lg p-2 text-left",
        selectedRoomId === room.roomId ? "bg-accent" : "hover:bg-muted",
      )}
      onClick={() => handleRoomSelect(room.roomId)}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage
            src={getRoomAvatar(room, room.client.baseUrl)}
            alt={room.name}
          />
          <AvatarFallback>
            {room.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="font-medium">{room.name}</span>
          {/* <span className="text-xs text-muted-foreground">
          {room.time}
        </span> */}
        </div>
        <div className="flex items-center">
          <span className="flex-1 min-w-0 w-0 truncate text-sm text-muted-foreground">
            {getLatestMessageText(room)}
          </span>
          {room.getUnreadNotificationCount(NotificationCountType.Total) > 0 && (
            <span className="ml-2 flex h-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              {room.getUnreadNotificationCount(NotificationCountType.Total)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
});

export function RoomListItemSkeleton() {
  return (
    <button
      className="flex items-center gap-3 rounded-lg p-2 text-left hover:bg-muted"
      disabled
    >
      <div className="relative">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24 rounded-sm" />
        </div>
        <div className="flex items-center mt-1">
          <Skeleton className="flex-1 h-5 rounded-sm" />
        </div>
      </div>
    </button>
  );
}
