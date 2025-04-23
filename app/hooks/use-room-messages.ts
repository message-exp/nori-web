import * as sdk from "matrix-js-sdk";
import { useEffect, useState } from "react";
import { getRoomMessages } from "~/lib/matrix-api/room";

export function useRoomMessages(room: sdk.Room | null | undefined) {
  const [messages, setMessages] = useState<sdk.MatrixEvent[]>([]);

  useEffect(() => {
    if (!room) {
      setMessages([]);
      return;
    }

    // Initial load
    const initialMessages = getRoomMessages(room);
    setMessages(initialMessages);

    // Listen for new messages
    const handleRoomTimeline = (
      event: sdk.MatrixEvent,
      roomState: sdk.RoomState,
      toStartOfTimeline: boolean,
      removed: boolean,
      data: { liveEvent: boolean },
    ) => {
      if (
        event.getRoomId() === room.roomId &&
        event.getType() === "m.room.message" &&
        data.liveEvent
      ) {
        setMessages((current) => [...current, event]);
      }
    };

    room.on("Room.timeline", handleRoomTimeline);

    return () => {
      room.removeListener("Room.timeline", handleRoomTimeline);
    };
  }, [room]);

  return messages;
}
