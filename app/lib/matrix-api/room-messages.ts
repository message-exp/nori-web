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

export async function sendTextMessage(roomId: string, body: string) {
  return await client.client.sendTextMessage(roomId, body);
}
