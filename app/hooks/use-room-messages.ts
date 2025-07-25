import * as sdk from "matrix-js-sdk";
import { useEffect, useMemo, useState } from "react";
import { client } from "~/lib/matrix-api/client";
import { getRoomMessages } from "~/lib/matrix-api/room-messages";
import { buildTimelineItems } from "~/lib/matrix-api/timeline-helper";
import type { TimelineItem } from "~/lib/matrix-api/timeline-item";

export function useRoomMessages(room: sdk.Room | null | undefined) {
  const MESSAGE_LIMIT = 100;
  const MESSAGE_PRE_LOAD = 30;

  const [messages, setMessages] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasNewer, setHasNewer] = useState(false);
  const [lastLoadDirection, setLastLoadDirection] = useState<
    "backwards" | "forwards" | null
  >(null);

  const timelineWindow = useMemo(() => {
    if (!room) return null;

    return new sdk.TimelineWindow(
      client.client,
      room.getUnfilteredTimelineSet(),
      { windowLimit: MESSAGE_LIMIT },
    );
  }, [room]);

  function getEventsFromTimelineWindow(
    window: sdk.TimelineWindow,
  ): TimelineItem[] {
    const events = window.getEvents();
    // console.log("getEvents() returned:", events.length, "events");
    return buildTimelineItems(events);
  }

  const initializeTimelineWindow = async (window: sdk.TimelineWindow) => {
    try {
      // 關鍵：先調用 load() 進行初始化
      await window.load(undefined, MESSAGE_PRE_LOAD); // 載入最新的 20 個事件

      // console.log("After load, events count:", window.getEvents().length);

      // 如果需要更多事件，可以再 paginate
      const hasMore = await window.paginate(
        sdk.EventTimeline.BACKWARDS,
        MESSAGE_PRE_LOAD,
      );
      // console.log("After paginate, events count:", window.getEvents().length);
      // console.log("Has more events:", hasMore);

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

      // 初始化後檢查兩個方向的狀態
      const backwardsHasMore = timelineWindow.canPaginate(
        sdk.EventTimeline.BACKWARDS,
      );
      const forwardsHasMore = timelineWindow.canPaginate(
        sdk.EventTimeline.FORWARDS,
      );

      setHasMore(backwardsHasMore);
      setHasNewer(forwardsHasMore);
    });
    getRoomMessages(room, MESSAGE_PRE_LOAD)
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

  const loadMessages = async (direction: "backwards" | "forwards") => {
    if (!room) return;
    if (!timelineWindow) return;
    setLoading(true);
    setLastLoadDirection(direction);

    try {
      const eventDirection =
        direction === "backwards"
          ? sdk.EventTimeline.BACKWARDS
          : sdk.EventTimeline.FORWARDS;

      const nowHasMore = await timelineWindow.paginate(
        eventDirection,
        MESSAGE_PRE_LOAD,
      );

      console.log(
        `After paginate ${direction}, events count:`,
        timelineWindow.getEvents().length,
      );
      console.log("Has more events:", nowHasMore);

      // 更新當前載入方向的狀態
      if (direction === "backwards") {
        setHasMore(nowHasMore);
      } else {
        setHasNewer(nowHasMore);
      }

      // 檢查相反方向的狀態
      // TimelineWindow 可能已經有足夠資料來判斷相反方向
      const oppositeDirection =
        direction === "backwards"
          ? sdk.EventTimeline.FORWARDS
          : sdk.EventTimeline.BACKWARDS;

      const oppositeHasMore = timelineWindow.canPaginate(oppositeDirection);

      if (direction === "backwards") {
        setHasNewer(oppositeHasMore);
      } else {
        setHasMore(oppositeHasMore);
      }

      console.log("has more: ", hasMore, " has newer: ", hasNewer);

      const newMessages = getEventsFromTimelineWindow(timelineWindow);
      const asc = newMessages.slice().reverse();
      setMessages(asc);
      setLoading(false);
    } catch (error) {
      console.error(`Failed to load ${direction} messages:`, error);
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    loadMessages,
    hasMore,
    hasNewer,
    lastLoadDirection,
  };
}
