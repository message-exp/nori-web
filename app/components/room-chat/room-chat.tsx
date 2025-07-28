import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  ChevronLeft,
  MessageSquare,
  Settings,
  UserRoundPlus,
} from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router";
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
import RoomChatContent from "./room-chat-content";

interface RoomChatProps {
  readonly onBackClick?: () => void;
}

export const RoomChat = memo(({ onBackClick = () => {} }: RoomChatProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { selectedRoomId } = useRoomContext();
  const [room, setRoom] = useState(getRoom(selectedRoomId));
  const [roomLoading, setRoomLoading] = useState(false);

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
    loadMessages,
    hasMore,
    hasNewer,
    lastLoadDirection,
    lastLoadTrigger,
  } = useRoomMessages(room);

  useEffect(() => {
    if (messages.length == 0 && loading) {
      setRoomLoading(true);
    } else {
      setRoomLoading(false);
    }
  }, [messages, loading]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const prevHeight = useRef(0);
  const atBottomRef = useRef(true);
  const prevMessageIdRef = useRef<string | undefined>(undefined);
  const bottomMessageIdRef = useRef<string | undefined>(undefined);

  const scrollToBottom = useCallback((scrollElement: HTMLElement) => {
    console.log("scroll to buttom");
    console.log("scroll height: ", scrollElement.scrollHeight);
    console.log("before scroll: ", scrollElement.scrollTop);

    requestAnimationFrame(() => {
      scrollElement.scrollTop = scrollElement.scrollHeight;
      console.log("after scroll: ", scrollElement.scrollTop);
    });
  }, []);

  const getReferenceId = useCallback(() => {
    if (lastLoadDirection === "forwards" && bottomMessageIdRef.current) {
      // 如果是新訊息觸發的載入，不使用參考點（會滾動到底部）
      if (lastLoadTrigger === "new_message") {
        return null;
      }
      return bottomMessageIdRef.current;
    }
    return prevMessageIdRef.current;
  }, [lastLoadDirection, lastLoadTrigger]);

  const scrollToReference = useCallback(
    (scrollElement: HTMLElement, referenceId: string) => {
      const refEl = scrollElement.querySelector<HTMLElement>(
        `[data-msg-id="${referenceId}"]`,
      );

      if (!refEl) return;

      if (lastLoadDirection === "forwards") {
        scrollElement.scrollTop =
          refEl.offsetTop - scrollElement.clientHeight + refEl.offsetHeight;
      } else {
        scrollElement.scrollTop = refEl.offsetTop;
      }
      console.log(
        `scroll to (${lastLoadDirection || "initial"}): `,
        referenceId,
      );
    },
    [lastLoadDirection],
  );

  const saveReferencePoints = useCallback(() => {
    prevMessageIdRef.current = messages[0].event?.getId();
    bottomMessageIdRef.current = messages[messages.length - 1].event?.getId();
    console.log("save top id:     ", messages[0].event?.getId());
    console.log(
      "save bottom id:  ",
      messages[messages.length - 1].event?.getId(),
    );
  }, [messages]);

  useLayoutEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) as HTMLElement | null;
    if (!scrollElement || messages.length === 0) return;

    const isInitialState =
      !prevMessageIdRef.current && !bottomMessageIdRef.current;

    if (isInitialState) {
      scrollToBottom(scrollElement);
    } else {
      console.log("top id:    ", prevMessageIdRef.current);
      console.log("bottom id: ", bottomMessageIdRef.current);
      console.log("load trigger: ", lastLoadTrigger);

      const referenceId = getReferenceId();
      if (referenceId) {
        scrollToReference(scrollElement, referenceId);
      } else if (lastLoadTrigger === "new_message") {
        // 新訊息進來時，滾動到底部
        scrollToBottom(scrollElement);
      }
    }

    saveReferencePoints();
  }, [
    messages,
    scrollToBottom,
    getReferenceId,
    scrollToReference,
    saveReferencePoints,
  ]);

  const handleScroll = useCallback(
    (event: Event) => {
      const target = event.target as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = target;

      atBottomRef.current = scrollTop + clientHeight >= scrollHeight - 1;

      // Load older messages when scrolled to top
      if (scrollTop === 0 && hasMore) {
        console.log("has more: ", hasMore);
        loadMessages("backwards");
      }

      // Load newer messages when scrolled to bottom
      if (scrollTop + clientHeight >= scrollHeight - 1 && hasNewer) {
        console.log("has newer: ", hasNewer);
        loadMessages("forwards", "user_scroll");
      }
    },
    [hasMore, hasNewer, loadMessages],
  );

  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    if (scrollElement) {
      prevHeight.current = scrollElement.scrollHeight;
      // Only scroll to bottom on initial load when no previous message ID exists
      if (!prevMessageIdRef.current && !bottomMessageIdRef.current) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
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
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <RoomChatContent
            roomLoading={roomLoading}
            messages={messages}
            hasMore={hasMore}
            hasNewer={hasNewer}
          />
        </ScrollArea>
      </div>
      <div className="border-t p-4">
        <MessageInput roomId={selectedRoomId} />
      </div>
    </div>
  );
});
