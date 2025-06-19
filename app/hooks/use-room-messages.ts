import * as sdk from "matrix-js-sdk";
import { useEffect, useState } from "react";
import { getRoomMessages } from "~/lib/matrix-api/room-messages";
import type { TimelineItem } from "~/lib/matrix-api/timeline-item";

export function useRoomMessages(room: sdk.Room | null | undefined) {
  const [messages, setMessages] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!room) {
      setMessages([]);
      return;
    }

    // Initial load
    setLoading(true);
    getRoomMessages(room, 20)
      .then((initialMessages) => {
        setMessages(initialMessages);
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
        getRoomMessages(room, 20)
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

  return { messages, loading };
}
