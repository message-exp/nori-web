import { ChevronLeft, MessageSquare, Search, X } from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MessageInput } from "~/components/room-chat/message-input";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useIsMobile } from "~/hooks/use-mobile";
import { useMergedRoomMessages } from "~/hooks/use-merged-room-messages";
import type { PlatformEnum } from "~/lib/contacts-server-api/types";
import type { TimelineItem } from "~/lib/matrix-api/timeline-item";
import RoomChatContent from "./room-chat-content";

interface RoomConfig {
  roomId: string;
  platform: PlatformEnum;
}

interface MergedRoomChatProps {
  readonly roomConfigs: RoomConfig[];
  readonly contactName: string;
  readonly onBackClick?: () => void;
}

const MergedRoomChatComponent = ({
  roomConfigs,
  contactName,
  onBackClick = () => {},
}: MergedRoomChatProps) => {
  const isMobile = useIsMobile();
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

  // Get merged messages from all rooms
  const {
    messages,
    loading,
    loadMessages,
    hasMore,
    hasNewer,
    lastLoadDirection,
    lastLoadTrigger,
  } = useMergedRoomMessages(roomConfigs);

  // Use ref to store latest messages to avoid callback re-creation
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0 && loading) {
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

  // Refs for cleanup in handleJumpToMessage
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollEndListenerRef = useRef<{
    element: HTMLElement;
    handler: () => void;
  } | null>(null);
  const scrollEndFallbackRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback((scrollElement: HTMLElement) => {
    requestAnimationFrame(() => {
      scrollElement.scrollTop = scrollElement.scrollHeight;
    });
  }, []);

  const getReferenceId = useCallback(() => {
    if (lastLoadDirection === "forwards" && bottomMessageIdRef.current) {
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
    },
    [lastLoadDirection],
  );

  const saveReferencePoints = useCallback(() => {
    if (messages.length === 0) return;

    prevMessageIdRef.current = messages.at(0)?.timelineItem.event?.getId();
    bottomMessageIdRef.current = messages.at(-1)?.timelineItem.event?.getId();
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
      const referenceId = getReferenceId();
      if (referenceId) {
        scrollToReference(scrollElement, referenceId);
      } else if (lastLoadTrigger === "new_message") {
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
    lastLoadTrigger,
  ]);

  const handleScroll = useCallback(
    (event: Event) => {
      const target = event.target as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = target;

      atBottomRef.current = scrollTop + clientHeight >= scrollHeight - 1;

      // Load older messages when scrolled to top
      if (scrollTop === 0 && hasMore) {
        loadMessages("backwards");
      }

      // Load newer messages when scrolled to bottom
      if (scrollTop + clientHeight >= scrollHeight - 1 && hasNewer) {
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
      if (!message.timelineItem.isMessage() || !message.timelineItem.event)
        continue;

      const content =
        message.timelineItem.event.getContent()["m.new_content"] ||
        message.timelineItem.event.getContent();
      const body = content.body || "";

      if (body.toLowerCase().includes(query)) {
        results.push(message.timelineItem);
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

    // Clean up any existing scroll end listener
    if (scrollEndListenerRef.current) {
      const { element, handler } = scrollEndListenerRef.current;
      element.removeEventListener("scrollend", handler);
      scrollEndListenerRef.current = null;
    }

    // Clean up any existing fallback timeout
    if (scrollEndFallbackRef.current) {
      clearTimeout(scrollEndFallbackRef.current);
      scrollEndFallbackRef.current = null;
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
            // Cleanup listener if it exists
            if (scrollEndListenerRef.current) {
              scrollElement.removeEventListener("scrollend", handleScrollEnd);
              scrollEndListenerRef.current = null;
            }
            // Cleanup fallback timeout if it exists
            if (scrollEndFallbackRef.current) {
              clearTimeout(scrollEndFallbackRef.current);
              scrollEndFallbackRef.current = null;
            }
          };

          // Check if browser supports scrollend event
          if ("onscrollend" in scrollElement) {
            scrollElement.addEventListener("scrollend", handleScrollEnd);
            // Store the listener for cleanup
            scrollEndListenerRef.current = {
              element: scrollElement,
              handler: handleScrollEnd,
            };
          } else {
            // Fallback: Use setTimeout to trigger highlight after scroll
            scrollEndFallbackRef.current = setTimeout(handleScrollEnd, 1000);
          }
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
      if (!prevMessageIdRef.current && !bottomMessageIdRef.current) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
      if (scrollEndListenerRef.current) {
        const { element, handler } = scrollEndListenerRef.current;
        element.removeEventListener("scrollend", handler);
      }
      if (scrollEndFallbackRef.current) {
        clearTimeout(scrollEndFallbackRef.current);
      }
    };
  }, []);

  // Extract roomIds from roomConfigs
  const roomIds = useMemo(
    () => roomConfigs.map((config) => config.roomId),
    [roomConfigs],
  );

  if (roomConfigs.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No rooms to display</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            This contact has no platform connections yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex flex-col border-b">
        {/* Main header row */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {isMobile ? (
              <Button variant="ghost" size="icon" onClick={onBackClick}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            ) : null}
            <div className="flex flex-col md:flex-row md:gap-2 md:items-center flex-1 min-w-0">
              <div className="min-w-0">
                <h3 className="font-medium">{contactName}</h3>
              </div>
              <div className="hidden md:block">
                <span className="text-sm text-muted-foreground">
                  {roomConfigs.length} platform
                  {roomConfigs.length === 1 ? "" : "s"} merged
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
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleSearch}
                aria-label="Search messages"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
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

      {/* Messages */}
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

      {/* Message input */}
      <div className="border-t p-4">
        {roomIds.length > 0 && <MessageInput roomIds={roomIds} />}
      </div>
    </div>
  );
};

export const MergedRoomChat = memo(MergedRoomChatComponent);
