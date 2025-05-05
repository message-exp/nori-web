import { Plus } from "lucide-react";
import { NotificationCountType, ClientEvent } from "matrix-js-sdk";
import type { Room } from "matrix-js-sdk";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { getRoomAvatar } from "~/lib/matrix-api/utils";
import { cn, getLatestMessageText } from "~/lib/utils";
import { CreateRoomDialog } from "./create-room-dialog";
import { useEffect, useState } from "react";
import { getRoomList } from "~/lib/matrix-api/room-list";
import { client } from "~/lib/matrix-api/client";
import { useNavigate } from "react-router";
import { refreshToken } from "~/lib/matrix-api/refresh-token";
import { DialogTrigger } from "@radix-ui/react-dialog";

interface RoomListProps {
  readonly selectedChat: string | null;
  readonly setSelectedChat: (chatId: string) => void;
}

export const RoomList: React.FC<RoomListProps> = ({
  selectedChat,
  setSelectedChat,
}) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const redirectIfAuthenticated = async () => {
      const refreshStatus = await refreshToken();
      console.log("refreshStatus", refreshStatus);
      if (refreshStatus === "REFRESH_FAILED") {
        navigate("/login");
      }
      setRooms(await getRoomList());
      client.client.on(ClientEvent.Room, async () => {
        setRooms(await getRoomList());
      });
    };
    redirectIfAuthenticated();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 pr-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Messages</h2>
          <CreateRoomDialog>
            <TooltipProvider>
              <Tooltip>
                <DialogTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Plus />
                    </Button>
                  </TooltipTrigger>
                </DialogTrigger>

                <TooltipContent>
                  <p>Create room</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CreateRoomDialog>
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
