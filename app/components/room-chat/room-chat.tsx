import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  ChevronLeft,
  MessageSquare,
  Settings,
  UserRoundPlus,
} from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { MessageItem } from "~/components/room-chat/message";
import { MessageInput } from "~/components/room-chat/message-input";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useRoomContext } from "~/contexts/room-context";
import { useIsMobile } from "~/hooks/use-mobile";
import { useRoomMessages } from "~/hooks/use-room-messages";
import { client } from "~/lib/matrix-api/client";
import { getRoom, getRoomTopic } from "~/lib/matrix-api/room";
import { InviteUserDialog } from "./invite-user-dialog";
import { useRoomAvatar } from "~/hooks/use-room-avatar";
import { avatarFallback } from "~/lib/utils";

interface RoomChatProps {
  readonly onBackClick?: () => void;
}

export const RoomChat = memo(({ onBackClick = () => {} }: RoomChatProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { selectedRoomId } = useRoomContext();
  const [room, setRoom] = useState(getRoom(selectedRoomId));

  const roomAvatarUrl = useRoomAvatar(room);

  // selected room changes
  useEffect(() => {
    if (selectedRoomId && client.client) {
      const room = getRoom(selectedRoomId);
      setRoom(room || null);
    } else {
      setRoom(null);
    }
  }, [selectedRoomId]);

  // get messages
  const { messages, loading } = useRoomMessages(room);

  // get to latest messages (scroll to bottom)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedRoomId || !room) {
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
          {isMobile ? (
            <Button variant="ghost" size="icon" onClick={onBackClick}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          ) : null}
          <Avatar>
            <AvatarImage src={roomAvatarUrl} alt={room?.name || ""} />
            <AvatarFallback>{avatarFallback(room.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-row gap-2">
            <div>
              <h3 className="font-medium">{room?.name}</h3>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">
                {getRoomTopic(room)}
              </span>
            </div>
            {/* <p className="text-sm text-muted-foreground">
              {room?.online
                ? "Online"
                : "Offline"}
            </p> */}
          </div>
        </div>
        <div className="flex gap-1">
          {/* <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button> */}
          <InviteUserDialog room={room}>
            <TooltipProvider>
              <Tooltip>
                <DialogTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <UserRoundPlus className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                </DialogTrigger>
                <TooltipContent>
                  <p>Invite</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </InviteUserDialog>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigate(`/home/${room.roomId}/settings`);
                  }}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {loading ? (
              <div className="flex justify-center text-muted-foreground">
                <p>Loading...</p>
              </div>
            ) : messages.length > 0 ? (
              [...messages]
                .reverse()
                .map((message) => (
                  <MessageItem key={message.event?.getId()} message={message} />
                ))
            ) : (
              <p className="text-center text-muted-foreground">
                No messages yet
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      <div className="border-t p-4">
        <MessageInput roomId={selectedRoomId} />
      </div>
    </div>
  );
});
