import * as sdk from "matrix-js-sdk";
import { useEffect, useMemo, useRef, useState } from "react";
import { client } from "~/lib/matrix-api/client";
import { buildTimelineItems } from "~/lib/matrix-api/timeline-helper";
import type { MergedTimelineItem } from "~/lib/matrix-api/timeline-item";
import type { PlatformEnum } from "~/lib/contacts-server-api/types";

interface RoomConfig {
  roomId: string;
  platform: PlatformEnum;
}

export function useMergedRoomMessages(roomConfigs: RoomConfig[]) {
  // Maximum number of messages to keep in the timeline window at once
  // This prevents memory issues with very long chat histories
  const MESSAGE_LIMIT = 100;

  // Number of messages to load per pagination request
  // A smaller number provides faster initial load and smoother scrolling experience
  // while still loading enough content to prevent frequent re-fetches
  const MESSAGE_PRE_LOAD = 23;

  const [messages, setMessages] = useState<MergedTimelineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasNewer, setHasNewer] = useState(false);
  const [lastLoadDirection, setLastLoadDirection] = useState<
    "backwards" | "forwards" | null
  >(null);
  const [lastLoadTrigger, setLastLoadTrigger] = useState<
    "user_scroll" | "new_message" | null
  >(null);

  // Use ref to track hasNewer for event listener
  const hasNewerRef = useRef(false);
  useEffect(() => {
    hasNewerRef.current = hasNewer;
  }, [hasNewer]);

  // Create stable roomIds dependency
  const roomIds = useMemo(
    () => roomConfigs.map((c) => c.roomId).join(","),
    [roomConfigs],
  );

  // Create TimelineWindows for each room
  const timelineWindows = useMemo(() => {
    if (!client.client || roomConfigs.length === 0) return [];

    return roomConfigs
      .map((config) => {
        const room = client.client!.getRoom(config.roomId);
        if (!room) return null;

        const window = new sdk.TimelineWindow(
          client.client!,
          room.getUnfilteredTimelineSet(),
          { windowLimit: MESSAGE_LIMIT },
        );

        return {
          window,
          roomId: config.roomId,
          platform: config.platform,
          room,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [roomIds]);

  function getEventsFromTimelineWindow(
    window: sdk.TimelineWindow,
    roomId: string,
    platform: PlatformEnum,
  ): MergedTimelineItem[] {
    const events = window.getEvents();
    const timelineItems = buildTimelineItems(events);

    return timelineItems.map((item) => ({
      timelineItem: item,
      roomId,
      platform,
    }));
  }

  const initializeTimelineWindow = async (
    window: sdk.TimelineWindow,
    roomId: string,
    platform: PlatformEnum,
  ) => {
    try {
      // Load the latest events
      await window.load(undefined, MESSAGE_PRE_LOAD);
      // Paginate to get more history
      await window.paginate(sdk.EventTimeline.BACKWARDS, MESSAGE_PRE_LOAD);

      return getEventsFromTimelineWindow(window, roomId, platform);
    } catch (error) {
      console.error(
        `Failed to initialize timeline window for room ${roomId}:`,
        error,
      );
      return [];
    }
  };

  // Initialize all timeline windows
  useEffect(() => {
    if (timelineWindows.length === 0) {
      setMessages([]);
      return;
    }

    setMessages([]);
    setLoading(true);

    Promise.all(
      timelineWindows.map((tw) =>
        initializeTimelineWindow(tw.window, tw.roomId, tw.platform),
      ),
    )
      .then((allMessages) => {
        // Merge all messages and sort by timestamp (ascending)
        const merged = allMessages
          .flat()
          .sort(
            (a, b) =>
              (a.timelineItem.getTimestamp() ?? 0) -
              (b.timelineItem.getTimestamp() ?? 0),
          );

        setMessages(merged);

        // Check if any room has more messages
        const anyHasMore = timelineWindows.some((tw) =>
          tw.window.canPaginate(sdk.EventTimeline.BACKWARDS),
        );
        const anyHasNewer = timelineWindows.some((tw) =>
          tw.window.canPaginate(sdk.EventTimeline.FORWARDS),
        );

        setHasMore(anyHasMore);
        setHasNewer(anyHasNewer);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load merged messages:", error);
        setLoading(false);
      });

    // Set up Timeline event listeners for all rooms
    const handleRoomTimeline = (
      event: sdk.MatrixEvent,
      roomArg: sdk.Room | undefined,
      toStartOfTimeline?: boolean,
      removed?: boolean,
      data?: sdk.IRoomTimelineData,
    ) => {
      // Check if this event is from one of our tracked rooms and is a live event
      const relevantWindow = timelineWindows.find(
        (tw) => tw.roomId === event.getRoomId(),
      );

      if (!relevantWindow || !data?.liveEvent) {
        return;
      }

      // If hasNewer=true, pause auto-update (user is scrolling up)
      if (hasNewerRef.current) {
        return;
      }

      // Update messages by re-fetching from all windows
      try {
        const canPaginateForwards = relevantWindow.window.canPaginate(
          sdk.EventTimeline.FORWARDS,
        );

        if (canPaginateForwards) {
          // Paginate to get the new message
          relevantWindow.window
            .paginate(sdk.EventTimeline.FORWARDS, 1)
            .then(() => {
              // Refresh all messages
              const allMessages = timelineWindows.flatMap((tw) =>
                getEventsFromTimelineWindow(tw.window, tw.roomId, tw.platform),
              );

              const merged = allMessages.sort(
                (a, b) =>
                  (a.timelineItem.getTimestamp() ?? 0) -
                  (b.timelineItem.getTimestamp() ?? 0),
              );

              setMessages(merged);
              setLastLoadDirection("forwards");
              setLastLoadTrigger("new_message");

              // Update hasNewer state
              const stillHasNewer = timelineWindows.some((tw) =>
                tw.window.canPaginate(sdk.EventTimeline.FORWARDS),
              );
              setHasNewer(stillHasNewer);
            });
        } else {
          // Directly update from current windows
          const allMessages = timelineWindows.flatMap((tw) =>
            getEventsFromTimelineWindow(tw.window, tw.roomId, tw.platform),
          );

          const merged = allMessages.sort(
            (a, b) =>
              (a.timelineItem.getTimestamp() ?? 0) -
              (b.timelineItem.getTimestamp() ?? 0),
          );

          setMessages(merged);
        }
      } catch (error) {
        console.error("Failed to handle timeline update:", error);
      }
    };

    // Register listeners for all rooms
    timelineWindows.forEach((tw) => {
      tw.room.on(sdk.RoomEvent.Timeline, handleRoomTimeline);
    });

    return () => {
      // Clean up listeners
      timelineWindows.forEach((tw) => {
        tw.room.removeListener(sdk.RoomEvent.Timeline, handleRoomTimeline);
      });
    };
  }, [timelineWindows]);

  const loadMessages = async (
    direction: "backwards" | "forwards",
    trigger: "user_scroll" | "new_message" = "user_scroll",
  ) => {
    if (timelineWindows.length === 0) return;

    setLoading(true);
    setLastLoadDirection(direction);
    setLastLoadTrigger(trigger);

    try {
      const eventDirection =
        direction === "backwards"
          ? sdk.EventTimeline.BACKWARDS
          : sdk.EventTimeline.FORWARDS;

      // Paginate all windows
      await Promise.all(
        timelineWindows.map((tw) =>
          tw.window.paginate(eventDirection, MESSAGE_PRE_LOAD),
        ),
      );

      // Get all messages from all windows
      const allMessages = timelineWindows.flatMap((tw) =>
        getEventsFromTimelineWindow(tw.window, tw.roomId, tw.platform),
      );

      // Merge and sort
      const merged = allMessages.sort(
        (a, b) =>
          (a.timelineItem.getTimestamp() ?? 0) -
          (b.timelineItem.getTimestamp() ?? 0),
      );

      setMessages(merged);

      // Update pagination status
      const anyHasMore = timelineWindows.some((tw) =>
        tw.window.canPaginate(sdk.EventTimeline.BACKWARDS),
      );
      const anyHasNewer = timelineWindows.some((tw) =>
        tw.window.canPaginate(sdk.EventTimeline.FORWARDS),
      );

      setHasMore(anyHasMore);
      setHasNewer(anyHasNewer);
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
