import { House, Inbox } from "lucide-react";
import { RoomList } from "@/components/room-list";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HomeSidebarProps {
  readonly selectedType: string | null;
  readonly setSelectedType: (type: string) => void;
  readonly selectedChat: string | null;
  readonly setSelectedChat: (chatId: string) => void;
}

export function HomePrimarySidebar({
  selectedType,
  setSelectedType,
  selectedChat,
  setSelectedChat,
}: HomeSidebarProps) {
  return (
    <div className="flex flex-row h-full">
      <div className="flex flex-col justify-between h-full p-2 border-r">
        <div className="flex flex-col gap-2">
          <Button
            key="home"
            variant="outline"
            size="icon"
            className="size-12"
            onClick={() => setSelectedType("home")}
          >
            <House className="size-6" />
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            key="inbox"
            variant="outline"
            size="icon"
            className="size-12"
            onClick={() => setSelectedType("inbox")}
          >
            <Inbox className="size-6" />
          </Button>
          <Button
            key="user"
            variant="outline"
            size="icon"
            className="size-12"
            onClick={() => setSelectedType("user")}
          >
            {/* <UserRound className="size-6" /> */}
            <Avatar className="rounded-sm">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="rounded-sm">CN</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        {selectedType === "home" ? (
          <RoomList
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        ) : (
          <div> {selectedType} </div>
        )}
      </div>
    </div>
  );
}
