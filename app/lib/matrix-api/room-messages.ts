import * as sdk from "matrix-js-sdk";
import { client } from "~/lib/matrix-api/client";

export async function getRoomMessages(
  room: sdk.Room,
  limit = 20,
): Promise<sdk.MatrixEvent[]> {
  // First get the messages already in the live timeline
  const timelineSet = room.getUnfilteredTimelineSet();
  const timeline = timelineSet.getLiveTimeline();
  let events = timeline
    .getEvents()
    .filter((event) => event.getType() === "m.room.message");

  // If we already have enough messages, return them
  if (events.length >= limit) {
    return events.slice(-limit).reverse(); // Get the latest messages
  }

  try {
    // We need to paginate backwards to get more messages
    await room.client.scrollback(room, limit - events.length);

    // After pagination, get the updated timeline events
    events = timeline
      .getEvents()
      .filter((event) => event.getType() === "m.room.message");
    return events.slice(-limit).reverse(); // Most recent last
  } catch (error) {
    console.error("Error fetching more messages:", error);
    return events.reverse(); // Return what we have if fetching more fails
  }
}

export async function sendTextMessage(roomId: string, body: string) {
  return await client.client.sendTextMessage(roomId, body);
}
