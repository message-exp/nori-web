import { MessageSquare } from "lucide-react";
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
import { ScrollArea } from "~/components/ui/scroll-area";
import { useMergedRoomMessages } from "~/hooks/use-merged-room-messages";
import type { PlatformEnum } from "~/lib/contacts-server-api/types";
import RoomChatContent from "./room-chat-content";

interface RoomConfig {
  roomId: string;
  platform: PlatformEnum;
}

interface MergedRoomChatProps {
  readonly roomConfigs: RoomConfig[];
  readonly contactName: string;
}

const MergedRoomChatComponent = ({
  roomConfigs,
  contactName,
}: MergedRoomChatProps) => {
  const [roomLoading, setRoomLoading] = useState(false);

  // Extract roomIds from roomConfigs
  const roomIds = useMemo(
    () => roomConfigs.map((config) => config.roomId),
    [roomConfigs],
  );

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

    prevMessageIdRef.current = messages[0].timelineItem.event?.getId();
    bottomMessageIdRef.current =
      messages[messages.length - 1].timelineItem.event?.getId();
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
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-row gap-2">
            <div>
              <h3 className="font-medium">{contactName}</h3>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">
                {roomConfigs.length} platform
                {roomConfigs.length !== 1 ? "s" : ""} merged
              </span>
            </div>
          </div>
        </div>
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
