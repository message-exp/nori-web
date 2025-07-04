import * as sdk from "matrix-js-sdk";
import { useCallback, useEffect, useState } from "react";
import {
  getRoomMessages,
  loadMoreMessages,
} from "~/lib/matrix-api/room-messages";
import type { TimelineItem } from "~/lib/matrix-api/timeline-item";

export function useRoomMessages(room: sdk.Room | null | undefined) {
  const [messages, setMessages] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!room) {
      setMessages([]);
      setHasMore(true);
      return;
    }

    // Initial load
    setLoading(true);
    getRoomMessages(room, 20)
      .then((initialMessages) => {
        console.log(
          "init load: initialMessages.length: ",
          initialMessages.length,
        );
        setMessages(initialMessages);
        // If we got fewer messages than requested, we've reached the end
        setHasMore(initialMessages.length >= 20);
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

  const loadMore = useCallback(async () => {
    if (!room || loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const result = await loadMoreMessages(room, 20);
      console.log("load more: result.hasMore: ", result.hasMore);
      setMessages(result.messages);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Failed to load more messages:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [room, loadingMore, hasMore]);

  return { messages, loading, loadingMore, hasMore, loadMore };
}
