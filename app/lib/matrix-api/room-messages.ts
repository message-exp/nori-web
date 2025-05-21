import * as sdk from "matrix-js-sdk";
import { client } from "~/lib/matrix-api/client";

interface MatrixEventWithOriginalTs extends sdk.MatrixEvent {
  _originalTs?: number;
}

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

  // --- Handle edits ---
  // Map from event_id to the latest event (original or edit)
  const eventMap = new Map<string, sdk.MatrixEvent>();

  for (const event of events) {
    const relatesTo = event.getContent()?.["m.relates_to"];
    if (
      relatesTo &&
      relatesTo["rel_type"] === "m.replace" &&
      relatesTo["event_id"]
    ) {
      // This is an edit, replace the original
      const originalEvent = eventMap.get(relatesTo["event_id"]);
      if (originalEvent) {
        // Store the original timestamp on the edit event
        (event as MatrixEventWithOriginalTs)._originalTs =
          originalEvent.getTs();
      }
      eventMap.set(relatesTo["event_id"], event);
    } else {
      // Only set if not already replaced by an edit
      const eventId = event.getId();
      if (eventId && !eventMap.has(eventId)) {
        eventMap.set(eventId, event);
      }
    }
  }

  // Only keep the latest version of each message
  events = Array.from(eventMap.values());

  // Sort from oldest to newest (ascending)
  events = events.sort((a, b) => b.getTs() - a.getTs());

  // If we already have enough messages, return them
  if (events.length >= limit) {
    return events.slice(-limit); // get the latest N messages
  }

  try {
    // We need to paginate backwards to get more messages
    await room.client.scrollback(room, limit - events.length);

    // After pagination, repeat the edit handling
    events = timeline
      .getEvents()
      .filter((event) => event.getType() === "m.room.message");

    // --- Handle edits again after pagination ---
    eventMap.clear();
    for (const event of events) {
      const relatesTo = event.getContent()?.["m.relates_to"];
      if (
        relatesTo &&
        relatesTo["rel_type"] === "m.replace" &&
        relatesTo["event_id"]
      ) {
        eventMap.set(relatesTo["event_id"], event);
      } else {
        const eventId = event.getId();
        if (eventId && !eventMap.has(eventId)) {
          eventMap.set(eventId, event);
        }
      }
    }
    events = Array.from(eventMap.values());
    events = events.sort((a, b) => b.getTs() - a.getTs());
    return events.slice(-limit);
  } catch (error) {
    console.error("Error fetching more messages:", error);
    return events.sort((a, b) => b.getTs() - a.getTs());
  }
}

export async function sendTextMessage(roomId: string, body: string) {
  return await client.client.sendTextMessage(roomId, body);
}
