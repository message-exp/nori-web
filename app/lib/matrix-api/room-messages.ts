import * as sdk from "matrix-js-sdk";
import { client } from "~/lib/matrix-api/client";
import { buildTimelineItems } from "~/lib/matrix-api/timeline-helper";
import type { TimelineItem } from "~/lib/matrix-api/timeline-item";

export async function getRoomMessages(
  room: sdk.Room,
  limit = 20,
): Promise<TimelineItem[]> {
  // first get the messages already in the live timeline
  const timelineSet = room.getUnfilteredTimelineSet();
  const timeline = timelineSet.getLiveTimeline();

  // paginate backwards to get more messages
  await room.client.scrollback(room, limit);

  const events = timeline.getEvents();

  return buildTimelineItems(events);
}

export async function loadMoreMessages(
  room: sdk.Room,
  limit = 20,
): Promise<{ messages: TimelineItem[]; hasMore: boolean }> {
  console.log("loading more message");
  const timelineSet = room.getUnfilteredTimelineSet();
  const timeline = timelineSet.getLiveTimeline();

  // Store current event count to check if we got new ones
  const currentEventCount = timeline.getEvents().length;

  // Check if we can paginate using getPaginationToken
  const paginationToken = timeline.getPaginationToken(
    sdk.EventTimeline.BACKWARDS,
  );
  const canPaginate = paginationToken !== null;

  if (!canPaginate) {
    // No more messages to load
    return {
      messages: buildTimelineItems(timeline.getEvents()),
      hasMore: false,
    };
  }

  await room.client.scrollback(room, limit);

  const events = timeline.getEvents();
  const newEventCount = events.length;

  // Check if we actually got new messages and if we can still paginate
  const hasMore =
    newEventCount > currentEventCount &&
    timeline.getPaginationToken(sdk.EventTimeline.BACKWARDS) !== null;

  return { messages: buildTimelineItems(events), hasMore };
}

export async function sendTextMessage(roomId: string, body: string) {
  return await client.client.sendTextMessage(roomId, body);
}
