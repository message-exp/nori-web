import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  ChevronLeft,
  MessageSquare,
  Settings,
  UserRoundPlus,
} from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
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
import { getRoomAvatar } from "~/lib/matrix-api/utils";
import { InviteUserDialog } from "./invite-user-dialog";

interface RoomChatProps {
  readonly onBackClick?: () => void;
}

export const RoomChat = memo(({ onBackClick = () => {} }: RoomChatProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { selectedRoomId } = useRoomContext();
  const [room, setRoom] = useState(getRoom(selectedRoomId));

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
  const {
    messages,
    loading,
    loadingMore,
    hasMore,
    hasMoreNewer,
    loadMore,
    windowInfo,
  } = useRoomMessages(room);

  // get to latest messages (scroll to bottom)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  // Scroll to bottom when messages change (only if user was at bottom)
  useEffect(() => {
    if (shouldScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, shouldScrollToBottom]);

  // Handle scroll events for infinite scroll
  const handleScroll = useCallback(
    (event: Event) => {
      const target = event.target as HTMLDivElement;
      if (!target) return;

      const { scrollTop, scrollHeight, clientHeight } = target;
      console.log(`target: ${scrollTop},  ${scrollHeight}, ${clientHeight}`);

      // Check if user is at the bottom (within 50px)
      const atBottom = scrollHeight - scrollTop - clientHeight < 50;
      console.log("atBottom: ", atBottom);
      setShouldScrollToBottom(atBottom);

      // Check if user scrolled to top (within 50px) and load older messages
      if (scrollTop < 50 && hasMore && !loadingMore) {
        console.log("detect to top, start load older messages");
        const previousScrollHeight = scrollHeight;
        loadMore("older").then(() => {
          // Maintain scroll position after loading more messages
          if (scrollAreaRef.current) {
            const newScrollHeight = scrollAreaRef.current.scrollHeight;
            const scrollDiff = newScrollHeight - previousScrollHeight;
            scrollAreaRef.current.scrollTop = scrollTop + scrollDiff;
          }
        });
      }

      // Check if user scrolled to bottom (within 50px) and load newer messages
      if (atBottom && hasMoreNewer && !loadingMore) {
        console.log("detect to bottom, start load newer messages");
        loadMore("newer").then(() => {
          // Keep at bottom after loading newer messages
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop =
              scrollAreaRef.current.scrollHeight;
          }
        });
      }
    },
    [hasMore, hasMoreNewer, loadingMore, loadMore],
  );

  // Add scroll event listener
  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

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
            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === "development" && (
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                Messages: {messages.length} | Window:{" "}
                {windowInfo.oldestMessageIndex}-{windowInfo.newestMessageIndex}{" "}
                | Total Est: {windowInfo.totalEstimate} | HasMore:{" "}
                {hasMore.toString()} | HasNewer: {hasMoreNewer.toString()}
              </div>
            )}
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
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-4 p-4">
            {loadingMore && (
              <div className="flex justify-center text-muted-foreground py-2">
                <p>Loading more messages...</p>
              </div>
            )}
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
