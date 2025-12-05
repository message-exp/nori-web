import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  ChevronLeft,
  MessageSquare,
  Search,
  Settings,
  UserRoundPlus,
  X,
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
import { RoomAvatar } from "~/components/ui/room-avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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
import type { TimelineItem } from "~/lib/matrix-api/timeline-item";
import { InviteUserDialog } from "./invite-user-dialog";
import RoomChatContent from "./room-chat-content";

interface RoomChatProps {
  readonly onBackClick?: () => void;
}

const RoomChatComponent = ({ onBackClick = () => {} }: RoomChatProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { selectedRoomId } = useRoomContext();
  const [room, setRoom] = useState(getRoom(selectedRoomId));
  const [roomLoading, setRoomLoading] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TimelineItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Highlighted message state
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);

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

  // Use ref to store latest messages to avoid callback re-creation
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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

  // Ref for cleanup timeout in handleJumpToMessage
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback((scrollElement: HTMLElement) => {
    console.log("scroll to bottom");
    console.log("scroll height: ", scrollElement.scrollHeight);
    console.log("before scroll: ", scrollElement.scrollTop);

    requestAnimationFrame(() => {
      scrollElement.scrollTop = scrollElement.scrollHeight;
    });
  }, []);

  const getReferenceId = useCallback(() => {
    if (lastLoadDirection === "forwards" && bottomMessageIdRef.current) {
      // If loading is triggered by a new message, do not use a reference point (will scroll to the bottom)
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

  // Search messages
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: TimelineItem[] = [];
    const MAX_RESULTS = 50;

    for (const message of messagesRef.current) {
      if (!message.isMessage() || !message.event) continue;

      const content =
        message.event.getContent()["m.new_content"] ||
        message.event.getContent();
      const body = content.body || "";

      if (body.toLowerCase().includes(query)) {
        results.push(message);
        if (results.length >= MAX_RESULTS) break;
      }
    }

    setSearchResults(results);
    setIsSearching(true);
  }, [searchQuery]);

  // Handle search input change
  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  // Handle search submit
  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSearch();
    },
    [handleSearch],
  );

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  // Toggle search input (mobile)
  const handleToggleSearch = useCallback(() => {
    setShowSearchInput((prev) => !prev);
    // Clear search when closing
    if (showSearchInput) {
      setSearchQuery("");
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [showSearchInput]);

  // Jump to message
  const handleJumpToMessage = useCallback((messageId: string) => {
    // Clean up any existing highlight timeout
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = null;
    }

    // First, clear search to show all messages
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);

    // Clear any existing highlight to allow re-triggering animation
    setHighlightedMessageId(null);

    // Wait for browser to complete rendering using RAF
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const scrollElement = scrollAreaRef.current?.querySelector(
          "[data-radix-scroll-area-viewport]",
        ) as HTMLElement | null;

        if (!scrollElement) return;

        const messageElement = scrollElement.querySelector<HTMLElement>(
          `[data-msg-id="${messageId}"]`,
        );

        if (messageElement) {
          messageElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          const handleScrollEnd = () => {
            // Verify the message is still in DOM and visible
            if (document.contains(messageElement)) {
              setHighlightedMessageId(messageId);
              highlightTimeoutRef.current = setTimeout(() => {
                setHighlightedMessageId(null);
                highlightTimeoutRef.current = null;
              }, 2000);
            }
            scrollElement.removeEventListener("scrollend", handleScrollEnd);
          };

          scrollElement.addEventListener("scrollend", handleScrollEnd);
        }
      });
    });
  }, []);

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

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
      <div className="flex flex-col border-b">
        {/* Main header row */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {isMobile ? (
              <Button variant="ghost" size="icon" onClick={onBackClick}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            ) : null}
            <RoomAvatar
              roomId={room?.roomId || ""}
              roomName={room?.name || "Unknown Room"}
              fallbackAvatarUrl={room?.getAvatarUrl(
                room.client.baseUrl,
                64,
                64,
                "crop",
              )}
            />
            <div className="flex flex-col md:flex-row md:gap-2 md:items-center flex-1 min-w-0">
              <div className="min-w-0">
                <h3 className="font-medium truncate">{room?.name}</h3>
              </div>
              <div className="hidden md:block">
                <span className="text-sm text-muted-foreground truncate">
                  {getRoomTopic(room)}
                </span>
              </div>
              {/* Search input - Desktop only (inline) */}
              {!isMobile && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center gap-2 ml-4"
                >
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      className="w-48 h-8 pr-8"
                    />
                    {searchQuery && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-8 w-8"
                        onClick={handleClearSearch}
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear search</span>
                      </Button>
                    )}
                  </div>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Search messages"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            {/* Search toggle button - Mobile only */}
            {isMobile && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleToggleSearch}
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search messages</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
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
        {/* Search bar - Mobile only (collapsible) */}
        {isMobile && showSearchInput && (
          <div className="px-4 pb-4 border-t">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 pt-3"
            >
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="h-8 pr-8"
                  autoFocus
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-8 w-8"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                )}
              </div>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                aria-label="Search messages"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <RoomChatContent
            roomLoading={roomLoading}
            messages={messages}
            hasMore={hasMore}
            hasNewer={hasNewer}
            loading={loading}
            isSearching={isSearching}
            searchResults={searchResults}
            onJumpToMessage={handleJumpToMessage}
            highlightedMessageId={highlightedMessageId}
          />
        </ScrollArea>
      </div>
      <div className="border-t p-4">
        <MessageInput roomIds={[selectedRoomId]} />
      </div>
    </div>
  );
};

export const RoomChat = memo(RoomChatComponent);
