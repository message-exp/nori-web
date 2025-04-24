import { Plus } from "lucide-react";
import { NotificationCountType } from "matrix-js-sdk";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useRoomList } from "~/hooks/use-room-list";
import { getRoomAvatar } from "~/lib/matrix-api/utils";
import { cn, getLatestMessageText } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface RoomListProps {
  readonly selectedChat: string | null;
  readonly setSelectedChat: (chatId: string) => void;
}

export const RoomList: React.FC<RoomListProps> = ({
  selectedChat,
  setSelectedChat,
}) => {
  const rooms = useRoomList();

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 pr-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Messages</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="ghost" size="icon">
                  <Plus />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create room</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <ScrollArea className="flex-1 h-[calc(100vh-60px)]">
        <div className="flex flex-col gap-1 p-2">
          {rooms.map((room) => (
            <button
              key={room.roomId}
              className={cn(
                "flex items-center gap-3 rounded-lg p-2 text-left",
                selectedChat === room.roomId ? "bg-accent" : "hover:bg-muted",
              )}
              onClick={() => setSelectedChat(room.roomId)}
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
                  {room.getUnreadNotificationCount(
                    NotificationCountType.Total,
                  ) > 0 && (
                    <span className="ml-2 flex h-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                      {room.getUnreadNotificationCount(
                        NotificationCountType.Total,
                      )}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
