import * as sdk from "matrix-js-sdk";
import { useEffect, useState } from "react";
import { getRoomMessages } from "@/lib/matrix-api/room-messages";

export function useRoomMessages(room: sdk.Room | null | undefined) {
  const [messages, setMessages] = useState<sdk.MatrixEvent[]>([]);
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
      if (
        event.getRoomId() === room?.roomId &&
        event.getType() === "m.room.message" &&
        data?.liveEvent
      ) {
        setMessages((current) => [event, ...current]);
      }
    };

    room.on(sdk.RoomEvent.Timeline, handleRoomTimeline);

    return () => {
      room.removeListener(sdk.RoomEvent.Timeline, handleRoomTimeline);
    };
  }, [room]);

  return { messages, loading };
}
