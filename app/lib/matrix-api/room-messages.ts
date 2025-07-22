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
  console.log("timelineSet: ", timelineSet);
  const timeline = timelineSet.getLiveTimeline();
  console.log("timeline", timeline);

  // paginate backwards to get more messages
  await room.client.scrollback(room, limit);

  const events = timeline.getEvents();

  console.log("length: ", events.length);

  return buildTimelineItems(events);
}

export async function sendTextMessage(roomId: string, body: string) {
  return await client.client.sendTextMessage(roomId, body);
}
