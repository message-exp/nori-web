import * as sdk from "matrix-js-sdk";
import { useEffect, useMemo, useState } from "react";
import { client } from "~/lib/matrix-api/client";
import { buildTimelineItems } from "~/lib/matrix-api/timeline-helper";
import type { TimelineItem } from "~/lib/matrix-api/timeline-item";

export function useRoomMessages(room: sdk.Room | null | undefined) {
  const MESSAGE_LIMIT = 100;
  const MESSAGE_PRE_LOAD = 23;

  const [messages, setMessages] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasNewer, setHasNewer] = useState(false);
  const [lastLoadDirection, setLastLoadDirection] = useState<
    "backwards" | "forwards" | null
  >(null);
  const [lastLoadTrigger, setLastLoadTrigger] = useState<
    "user_scroll" | "new_message" | null
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
    return buildTimelineItems(events);
  }

  const initializeTimelineWindow = async (window: sdk.TimelineWindow) => {
    try {
      // Key: call load() first to initialize
      // Key: call load() to initialize the timeline window
      await window.load(undefined, MESSAGE_PRE_LOAD); // Load the latest 23 events

      // If more events are needed, you can paginate again
      await window.paginate(sdk.EventTimeline.BACKWARDS, MESSAGE_PRE_LOAD);

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

  useEffect(() => {
    if (!room || !timelineWindow) {
      setMessages([]);
      return;
    }

    setMessages([]);
    setLoading(true);
    initializeTimelineWindow(timelineWindow)
      .then((initialMessages) => {
        // buildTimelineItems returns newest first, keep ascending
        const asc = initialMessages.slice().reverse();
        setMessages(asc);

        // After initialization, check the status of both directions
        const backwardsHasMore = timelineWindow.canPaginate(
          sdk.EventTimeline.BACKWARDS,
        );
        const forwardsHasMore = timelineWindow.canPaginate(
          sdk.EventTimeline.FORWARDS,
        );

        setHasMore(backwardsHasMore);
        setHasNewer(forwardsHasMore);
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
      // Only handle live events for the current room
      if (event.getRoomId() !== room?.roomId || !data?.liveEvent) {
        return;
      }

      // Only handle live events for the current room
      if (event.getRoomId() !== room?.roomId || !data?.liveEvent) {
        return;
      }

      // If hasNewer=true, it means the user is scrolling up, so pause the auto-update mechanism
      if (hasNewer) {
        console.log(
          "Pausing timeline updates - user scrolling up (hasNewer=true)",
        );
        return;
      }

      // Use timelineWindow instead of rebuilding directly from room
      if (timelineWindow) {
        try {
          // Check if it is possible to paginate forwards (to get updated messages)
          const canPaginateForwards = timelineWindow.canPaginate(
            sdk.EventTimeline.FORWARDS,
          );

          if (canPaginateForwards) {
            // If there are newer messages, load them by paginating
            timelineWindow.paginate(sdk.EventTimeline.FORWARDS, 1).then(() => {
              const newMessages = getEventsFromTimelineWindow(timelineWindow);
              const asc = newMessages.slice().reverse();
              setMessages(asc);
              setLastLoadDirection("forwards");
              setLastLoadTrigger("new_message");

              // Update state
              const stillHasNewer = timelineWindow.canPaginate(
                sdk.EventTimeline.FORWARDS,
              );
              setHasNewer(stillHasNewer);
            });
          } else {
            // If there are no new messages to load, directly update the current timelineWindow messages
            const newMessages = getEventsFromTimelineWindow(timelineWindow);
            const asc = newMessages.slice().reverse();
            setMessages(asc);
          }
        } catch (error) {
          console.error("Failed to handle timeline update:", error);
          // If timelineWindow fails, fall back to the original method
          const current = buildFromRoom(room).slice().reverse();
          setMessages(current);
        }
      } else {
        // If there is no timelineWindow, fall back to the original method
        const current = buildFromRoom(room).slice().reverse();
        setMessages(current);
      }
    };

    room.on(sdk.RoomEvent.Timeline, handleRoomTimeline);

    return () => {
      room.removeListener(sdk.RoomEvent.Timeline, handleRoomTimeline);
    };
  }, [room]);

  useEffect(() => {
    // Debug log removed before production
  }, [hasMore, hasNewer, messages]);

  const loadMessages = async (
    direction: "backwards" | "forwards",
    trigger: "user_scroll" | "new_message" = "user_scroll",
  ) => {
    if (!room) return;
    if (!timelineWindow) return;
    setLoading(true);
    setLastLoadDirection(direction);
    setLastLoadTrigger(trigger);

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

      // Update the state for the current load direction
      if (direction === "backwards") {
        setHasMore(nowHasMore);
      } else {
        setHasNewer(nowHasMore);
      }

      // 檢查相反方向的狀態
      // Update the status for the current loading direction
      if (direction === "backwards") {
        setHasMore(nowHasMore);
      } else {
        setHasNewer(nowHasMore);
      }

      // Check the status in the opposite direction
      // TimelineWindow may already have enough data to determine the opposite direction
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
    lastLoadTrigger,
  };
}
