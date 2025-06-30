import * as sdk from "matrix-js-sdk";
import { useCallback, useEffect, useRef, useState } from "react";
import { debouncePromise } from "~/lib/debounce-helper";
import { getRoomMessagesOptimized } from "~/lib/matrix-api/room-messages";
import {
  buildInitialTimelineItems,
  createEmptyTimelineState,
  processIncomingEvent,
  type TimelineState,
} from "~/lib/matrix-api/timeline-processor";

export function useRoomMessages(room: sdk.Room | null | undefined) {
  const [timelineState, setTimelineState] = useState<TimelineState>(
    createEmptyTimelineState,
  );
  const [loading, setLoading] = useState(false);
  const timelineStateRef = useRef<TimelineState>(createEmptyTimelineState());

  // Keep ref in sync with state for event handlers
  useEffect(() => {
    timelineStateRef.current = timelineState;
  }, [timelineState]);

  // Debounced function for batch processing multiple rapid events
  const debouncedProcessEvents = useCallback(
    debouncePromise(async (roomArg: sdk.Room) => {
      const timeline = roomArg.getUnfilteredTimelineSet().getLiveTimeline();
      const events = timeline.getEvents();
      const newState = buildInitialTimelineItems(events);
      setTimelineState(newState);
    }, 100),
    [],
  );

  useEffect(() => {
    if (!room) {
      setTimelineState(createEmptyTimelineState());
      return;
    }

    // Initial load
    setLoading(true);
    getRoomMessagesOptimized(room, 20)
      .then((initialState) => {
        setTimelineState(initialState);
        setLoading(false);
      })
      .catch((error: unknown) => {
        console.error("Failed to load messages:", error);
        setLoading(false);
      });

    // Listen for new messages with optimized processing
    const handleRoomTimeline = (
      event: sdk.MatrixEvent,
      roomArg: sdk.Room | undefined,
      toStartOfTimeline?: boolean,
      removed?: boolean,
      data?: sdk.IRoomTimelineData,
    ) => {
      if (event.getRoomId() !== room?.roomId || !data?.liveEvent) {
        return;
      }

      // For live events, process incrementally
      const currentState = timelineStateRef.current;
      const newState = processIncomingEvent(event, currentState);

      // Only update state if something actually changed
      if (newState !== currentState) {
        setTimelineState(newState);
      }
    };

    // Fallback: if we get too many events rapidly, do a full refresh
    const handleRoomTimelineReset = () => {
      if (room) {
        debouncedProcessEvents(room);
      }
    };

    room.on(sdk.RoomEvent.Timeline, handleRoomTimeline);
    room.on(sdk.RoomEvent.TimelineReset, handleRoomTimelineReset);

    return () => {
      room.removeListener(sdk.RoomEvent.Timeline, handleRoomTimeline);
      room.removeListener(sdk.RoomEvent.TimelineReset, handleRoomTimelineReset);
    };
  }, [room, debouncedProcessEvents]);

  return {
    messages: timelineState.messages,
    loading,
  };
}
