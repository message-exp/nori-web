import * as sdk from "matrix-js-sdk";
import { useEffect, useState } from "react";
import { getRoomMessages } from "~/lib/matrix-api/room-messages";
import { buildTimelineItems } from "~/lib/matrix-api/timeline-helper";
import type { TimelineItem } from "~/lib/matrix-api/timeline-item";

export function useRoomMessages(room: sdk.Room | null | undefined) {
  const MESSAGE_LIMIT = 100;

  const [messages, setMessages] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(false);

  function buildFromRoom(room: sdk.Room) {
    const timeline = room.getUnfilteredTimelineSet().getLiveTimeline();
    const events = timeline.getEvents();
    return buildTimelineItems(events);
  }

  function trimStart(items: TimelineItem[]): TimelineItem[] {
    if (items.length <= MESSAGE_LIMIT) return items;
    return items.slice(items.length - MESSAGE_LIMIT);
  }

  function trimEnd(items: TimelineItem[]): TimelineItem[] {
    if (items.length <= MESSAGE_LIMIT) return items;
    return items.slice(0, MESSAGE_LIMIT);
  }

  useEffect(() => {
    if (!room) {
      setMessages([]);
      return;
    }

    setLoading(true);
    getRoomMessages(room, 20)
      .then((initialMessages) => {
        // buildTimelineItems returns newest first, keep ascending
        const asc = initialMessages.slice().reverse();
        setMessages(trimStart(asc));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load messages:", error);
        setLoading(false);
      });

    const handleRoomTimeline = (
      event: sdk.MatrixEvent,
      roomArg: sdk.Room | undefined,
      toStartOfTimeline?: boolean,
      removed?: boolean,
      data?: sdk.IRoomTimelineData,
    ) => {
      if (event.getRoomId() === room?.roomId && data?.liveEvent) {
        const current = buildFromRoom(room).slice().reverse();
        setMessages(trimStart(current));
      }
    };

    room.on(sdk.RoomEvent.Timeline, handleRoomTimeline);

    return () => {
      room.removeListener(sdk.RoomEvent.Timeline, handleRoomTimeline);
    };
  }, [room]);

  const loadOlderMessages = async () => {
    if (!room) return;
    setLoading(true);
    getRoomMessages(room, 20)
      .then((newMessages) => {
        const asc = newMessages.slice().reverse();
        setMessages(trimEnd(asc));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load messages:", error);
        setLoading(false);
      });
  };

  return { messages, loading, loadOlderMessages };
}
