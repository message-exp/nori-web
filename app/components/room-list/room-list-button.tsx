import { NotificationCountType } from "matrix-js-sdk";
import { Room } from "matrix-js-sdk";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { avatarFallback, cn, getLatestMessageText } from "~/lib/utils";
import { BridgeIcon } from "../ui/bridge-icon";
import { useRoomAvatar } from "~/hooks/use-room-avatar";

interface RoomListButtonProps {
  readonly room: Room;
  readonly selectedRoomId?: string | null;
  readonly onRoomSelect: (roomId: string) => void;
}

export const RoomListButton = ({
  room,
  selectedRoomId,
  onRoomSelect,
}: RoomListButtonProps) => {
  const roomAvatarUrl = useRoomAvatar(room);

  return (
    <button
      key={room.roomId}
      className={cn(
        "flex items-center gap-3 rounded-lg p-2 text-left",
        selectedRoomId === room.roomId ? "bg-accent" : "hover:bg-muted",
      )}
      onClick={() => onRoomSelect(room.roomId)}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={roomAvatarUrl} alt={room.name} />
          <AvatarFallback>{avatarFallback(room.name)}</AvatarFallback>
        </Avatar>
        <BridgeIcon room={room} />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="font-medium">{room.name}</span>
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
};
