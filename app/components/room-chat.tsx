import { MessageSquare, Search, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { client } from "~/lib/matrix-api/client";

export function RoomChat({ selectedChat }: { selectedChat: string | null }) {
  const room = client.client.getRoom(selectedChat || undefined);

  return room ? (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={
                room?.getAvatarUrl(
                  client.client.getHomeserverUrl(), // baseUrl
                  128, // width
                  128, // height
                  "crop", // resizeMethod
                ) || undefined
              }
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
        <div className="flex gap-1">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
      <div className="flex-1 p-4">
        <div className="flex h-full flex-col justify-center items-center text-center text-muted-foreground">
          <MessageSquare className="h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium">
            Your messages will appear here
          </h3>
          <p className="max-w-md">
            This is a demo interface. In a real application, messages would be
            displayed in this area.
          </p>
        </div>
      </div>
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input placeholder="Type a message..." className="flex-1" />
          <Button>Send</Button>
        </div>
      </div>
    </div>
  ) : (
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
