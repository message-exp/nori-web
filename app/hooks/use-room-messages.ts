import * as sdk from "matrix-js-sdk";
import { useCallback, useEffect, useState } from "react";
import {
  getRoomMessages,
  loadMoreMessages,
} from "~/lib/matrix-api/room-messages";
import type { TimelineItem } from "~/lib/matrix-api/timeline-item";

// Sliding window constants
const MAX_MESSAGES = 400; // Maximum messages to keep in memory
const CLEANUP_THRESHOLD = 50; // Messages to remove when cleaning up
const LOAD_BATCH_SIZE = 20; // Messages to load per batch

export function useRoomMessages(room: sdk.Room | null | undefined) {
  const [messages, setMessages] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreNewer, setHasMoreNewer] = useState(false);

  // Sliding window state
  const [windowInfo, setWindowInfo] = useState({
    oldestMessageIndex: 0, // Index of oldest message in timeline
    newestMessageIndex: 0, // Index of newest message in timeline
    totalEstimate: 0, // Estimated total messages
  });

  // Helper function to apply sliding window cleanup
  const applyWindowCleanup = useCallback(
    (
      newMessages: TimelineItem[],
      direction: "older" | "newer",
    ): TimelineItem[] => {
      if (newMessages.length <= MAX_MESSAGES) {
        return newMessages;
      }

      console.log(
        `Applying cleanup: ${newMessages.length} messages, direction: ${direction}`,
      );

      if (direction === "older") {
        // Loading older messages - remove newest messages (from end)
        const cleaned = newMessages.slice(0, MAX_MESSAGES - CLEANUP_THRESHOLD);
        console.log(
          `Cleaned ${newMessages.length - cleaned.length} newest messages`,
        );
        return cleaned;
      } else {
        // Loading newer messages - remove oldest messages (from start)
        const cleaned = newMessages.slice(CLEANUP_THRESHOLD);
        console.log(`Cleaned ${CLEANUP_THRESHOLD} oldest messages`);
        return cleaned;
      }
    },
    [],
  );

  useEffect(() => {
    if (!room) {
      setMessages([]);
      setHasMore(true);
      return;
    }

    // Initial load
    setLoading(true);
    getRoomMessages(room, LOAD_BATCH_SIZE)
      .then((initialMessages) => {
        console.log(
          "init load: initialMessages.length: ",
          initialMessages.length,
        );

        const cleanedMessages = applyWindowCleanup(initialMessages, "older");
        setMessages(cleanedMessages);

        // If we got fewer messages than requested, we've reached the end
        setHasMore(initialMessages.length >= LOAD_BATCH_SIZE);
        setHasMoreNewer(false); // Initially we're at the newest messages

        // Initialize window info
        setWindowInfo({
          oldestMessageIndex: 0,
          newestMessageIndex: cleanedMessages.length - 1,
          totalEstimate: cleanedMessages.length,
        });

        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load messages:", error);
        setLoading(false);
      });

    // Listen for new messages
    const handleRoomTimeline = (
      event: sdk.MatrixEvent,
      roomArg: sdk.Room | undefined,
      toStartOfTimeline?: boolean,
      removed?: boolean,
      data?: sdk.IRoomTimelineData,
    ) => {
      if (event.getRoomId() === room?.roomId && data?.liveEvent) {
        getRoomMessages(room, Math.max(messages.length, 20))
          .then((messages) => {
            setMessages(messages);
          })
          .catch((error) => {
            console.error("Failed to load messages:", error);
          });
      }
    };

    room.on(sdk.RoomEvent.Timeline, handleRoomTimeline);

    return () => {
      room.removeListener(sdk.RoomEvent.Timeline, handleRoomTimeline);
    };
  }, [room]);

  const loadMore = useCallback(
    async (direction: "older" | "newer" = "older") => {
      if (!room || loadingMore) return;

      // Check if we can load in the requested direction
      if (direction === "older" && !hasMore) return;
      if (direction === "newer" && !hasMoreNewer) return;

      setLoadingMore(true);
      try {
        const result = await loadMoreMessages(room, LOAD_BATCH_SIZE);
        console.log(`load more ${direction}: result.hasMore: `, result.hasMore);

        // Apply sliding window cleanup
        const cleanedMessages = applyWindowCleanup(result.messages, direction);
        setMessages(cleanedMessages);

        // Update hasMore states
        setHasMore(result.hasMore);

        // Update window info
        setWindowInfo((prev) => ({
          ...prev,
          oldestMessageIndex:
            direction === "older"
              ? prev.oldestMessageIndex +
                (result.messages.length - cleanedMessages.length)
              : prev.oldestMessageIndex,
          newestMessageIndex: cleanedMessages.length - 1,
          totalEstimate: Math.max(prev.totalEstimate, cleanedMessages.length),
        }));

        // For now, we only support loading older messages
        // TODO: Implement newer message loading
        setHasMoreNewer(false);
      } catch (error) {
        console.error("Failed to load more messages:", error);
      } finally {
        setLoadingMore(false);
      }
    },
    [room, loadingMore, hasMore, hasMoreNewer, applyWindowCleanup],
  );

  return {
    messages,
    loading,
    loadingMore,
    hasMore,
    hasMoreNewer,
    loadMore,
    windowInfo,
  };
}
