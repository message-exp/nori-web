import { NotificationCountType } from "matrix-js-sdk";
import type { Room } from "matrix-js-sdk";
import { cn, getLatestMessageText } from "~/lib/utils";
import { BridgeIcon } from "../ui/bridge-icon";
import { RoomAvatar } from "~/components/ui/room-avatar";
import { detectPlatform } from "~/lib/matrix-api/utils";

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
        <RoomAvatar
          roomId={room.roomId}
          roomName={room.name || "Unknown Room"}
          fallbackAvatarUrl={room.getAvatarUrl(
            room.client.baseUrl,
            64,
            64,
            "crop",
          )}
        />
        {(() => {
          const platform = detectPlatform(room);
          // 如果是 Matrix 且 showMatrix=false (預設)，則不顯示任何東西
          if (platform === "Matrix") {
            return null;
          }
          return (
            <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-4 h-4 bg-gray-800 rounded-full ring-1 ring-gray-900">
              <BridgeIcon room={room} className="size-3 text-white" />
            </span>
          );
        })()}
        {/* <BridgeIcon room={room} className="h-3.5 w-3.5 text-white" /> */}
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
