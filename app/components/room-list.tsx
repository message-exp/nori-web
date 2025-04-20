import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { Chat } from "~/lib/example";
import { getRoomList } from "~/lib/matrix-api/room-list";
import { cn } from "~/lib/utils";

interface RoomListProps {
  readonly rooms: Chat[];
  readonly selectedChat: string | null;
  readonly setSelectedChat: (chatId: string) => void;
}

export const RoomList: React.FC<RoomListProps> = ({
  rooms,
  selectedChat,
  setSelectedChat,
}) => {
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const rooms = await getRoomList();
        console.log("完整 Matrix 房間資料：", rooms);
      } catch (err) {
        console.error("取得房間清單失敗", err);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4">
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>
      <ScrollArea className="flex-1 h-[calc(100vh-60px)]">
        <div className="flex flex-col gap-1 p-2">
          {rooms.map((room) => (
            <button
              key={room.id}
              className={cn(
                "flex items-center gap-3 rounded-lg p-2 text-left",
                selectedChat === room.id ? "bg-accent" : "hover:bg-muted",
              )}
              onClick={() => setSelectedChat(room.id)}
            >
              <div className="relative">
                <Avatar>
                  {room.avatar ? (
                    <AvatarImage
                      src={room.avatar || "/placeholder.svg"}
                      alt={room.name}
                    />
                  ) : (
                    <AvatarFallback>
                      {room.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  )}
                </Avatar>
                {room.online && (
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{room.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {room.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm text-muted-foreground">
                    {room.lastMessage}
                  </span>
                  {room.unread > 0 && (
                    <span className="ml-2 flex h-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                      {" "}
                      {/* min-w-5 */}
                      {room.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
    //   )}
    // </ResizablePanel>
  );
};
