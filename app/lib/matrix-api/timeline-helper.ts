import * as sdk from "matrix-js-sdk";
import { TimelineItem } from "./timeline-item";

export function buildTimelineItems(events: sdk.MatrixEvent[]): TimelineItem[] {
  const eventMap = new Map<string, TimelineItem>();

  for (const event of events) {
    const type = event.getType();
    const eventId = event.getId();
    if (!eventId) continue;

    // handle edits
    const relatesTo = event.getContent()?.["m.relates_to"];
    if (
      relatesTo &&
      relatesTo["rel_type"] === "m.replace" &&
      relatesTo["event_id"]
    ) {
      const original = eventMap.get(relatesTo["event_id"]);
      if (original && original.isMessage()) {
        // Replace content, preserve original timestamp
        const newItem = TimelineItem.fromMessage(
          event,
          original.getTimestamp(),
        );
        // Copy over reactions and redacted state
        newItem.reactions = new Map(original.reactions);
        newItem.redacted = original.redacted;
        eventMap.set(relatesTo["event_id"], newItem);
      } else {
        eventMap.set(relatesTo["event_id"], TimelineItem.fromMessage(event));
      }
      continue;
    }

    // handle reactions
    if (
      relatesTo &&
      relatesTo["rel_type"] === "m.annotation" &&
      relatesTo["event_id"]
    ) {
      const target = eventMap.get(relatesTo["event_id"]);
      if (target && target.isMessage()) {
        const key = relatesTo["key"];
        target.addReaction(key || "", event);
      }
      continue;
    }

    // handle redactions
    if (type === "m.room.redaction" && relatesTo && relatesTo["event_id"]) {
      const target = eventMap.get(relatesTo["event_id"]);
      if (target && target.isMessage()) {
        target.markRedacted();
      }
      continue;
    }

    // normal message
    if (type === "m.room.message") {
      eventMap.set(eventId, TimelineItem.fromMessage(event));
    }
  }

  // return sorted by timestamp (newest first)
  return Array.from(eventMap.values())
    .filter((item) => item.isMessage())
    .sort((a, b) => (b.getTimestamp() ?? 0) - (a.getTimestamp() ?? 0));
}
