import { MessageSquare, Search, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { MessageItem } from "~/components/room-chat/message";
import { MessageInput } from "~/components/room-chat/message-input";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useRoomMessages } from "~/hooks/use-room-messages";
import { client } from "~/lib/matrix-api/client";
import { getRoomAvatar } from "~/lib/matrix-api/utils";

interface RoomChatProps {
  readonly selectedChat: string | null;
}

export function RoomChat({ selectedChat }: RoomChatProps) {
  const [room, setRoom] = useState(
    client.client.getRoom(selectedChat || undefined),
  );

  useEffect(() => {
    if (selectedChat && client.client) {
      const room = client.client.getRoom(selectedChat);
      setRoom(room || null);
    } else {
      setRoom(null);
    }
  }, [selectedChat]);

  const messages = useRoomMessages(room);

  if (!selectedChat || !room) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No chat selected</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Select a chat from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={getRoomAvatar(room, room.client.baseUrl)}
              alt={room?.name || ""}
            />
            <AvatarFallback>
              {(room?.name || "")
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{room?.name}</h3>
            {/* <p className="text-sm text-muted-foreground">
              {room?.online
                ? "Online"
                : "Offline"}
            </p> */}
          </div>
        </div>
        {/* <div className="flex gap-1">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div> */}
      </div>
      <div className="flex-1 p-4">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length > 0 ? (
              messages.map((message) => (
                <MessageItem key={message.getId()} message={message} />
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No messages yet
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="border-t p-4">
        <MessageInput roomId={selectedChat} />
      </div>
    </div>
  );
}
