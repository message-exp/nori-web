import * as sdk from "matrix-js-sdk";
import { useEffect, useMemo, useState } from "react";
import { client } from "~/lib/matrix-api/client";
import { getRoomMessages } from "~/lib/matrix-api/room-messages";
import { buildTimelineItems } from "~/lib/matrix-api/timeline-helper";
import type { TimelineItem } from "~/lib/matrix-api/timeline-item";

export function useRoomMessages(room: sdk.Room | null | undefined) {
  const MESSAGE_LIMIT = 100;

  const [messages, setMessages] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(false);

  const timelineWindow = useMemo(() => {
    if (!room) return null;

    return new sdk.TimelineWindow(
      client.client,
      room.getUnfilteredTimelineSet(),
      { windowLimit: 100 },
    );
  }, [room]);

  function getEventsFromTimelineWindow(
    window: sdk.TimelineWindow,
  ): TimelineItem[] {
    const events = window.getEvents();
    console.log("getEvents() returned:", events.length, "events");
    return buildTimelineItems(events);
  }

  const initializeTimelineWindow = async (window: sdk.TimelineWindow) => {
    try {
      // 關鍵：先調用 load() 進行初始化
      await window.load(undefined, 20); // 載入最新的 20 個事件

      console.log("After load, events count:", window.getEvents().length);

      // 如果需要更多事件，可以再 paginate
      const hasMore = await window.paginate(sdk.EventTimeline.BACKWARDS, 20);
      console.log("After paginate, events count:", window.getEvents().length);
      console.log("Has more events:", hasMore);

      return getEventsFromTimelineWindow(window);
    } catch (error) {
      console.error("Failed to initialize timeline window:", error);
      throw error;
    }
  };

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
    if (!room || !timelineWindow) {
      setMessages([]);
      return;
    }

    setLoading(true);
    initializeTimelineWindow(timelineWindow).then((initialMessages) => {
      console.log("init timelinewindows: ", initialMessages);
    });
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
    if (!timelineWindow) return;
    setLoading(true);

    try {
      const hasMore = await timelineWindow.paginate(
        sdk.EventTimeline.BACKWARDS,
        20,
      );
      console.log(
        "After paginate backwards, events count:",
        timelineWindow.getEvents().length,
      );
      console.log("Has more events:", hasMore);

      const newMessages = getEventsFromTimelineWindow(timelineWindow);
      const asc = newMessages.slice().reverse();
      setMessages(trimEnd(asc));
      setLoading(false);
    } catch (error) {
      console.error("Failed to load older messages:", error);
      setLoading(false);
    }
  };

  return { messages, loading, loadOlderMessages };
}
