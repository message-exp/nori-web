import * as sdk from "matrix-js-sdk";
import { TimelineItem } from "./timeline-item";

export interface TimelineState {
  messages: TimelineItem[];
  messageMap: Map<string, TimelineItem>;
  lastProcessedEventId?: string;
}

export function createEmptyTimelineState(): TimelineState {
  return {
    messages: [],
    messageMap: new Map(),
    lastProcessedEventId: undefined,
  };
}

export function buildInitialTimelineItems(
  events: sdk.MatrixEvent[],
): TimelineState {
  const messageMap = new Map<string, TimelineItem>();

  for (const event of events) {
    processEventIntoMap(event, messageMap);
  }

  // Sort messages by timestamp (newest first)
  const messages = Array.from(messageMap.values())
    .filter((item) => item.isMessage())
    .sort((a, b) => (b.originalTs ?? 0) - (a.originalTs ?? 0));

  return {
    messages,
    messageMap,
    lastProcessedEventId: events[events.length - 1]?.getId(),
  };
}

export function processIncomingEvent(
  event: sdk.MatrixEvent,
  state: TimelineState,
): TimelineState {
  const newMessageMap = new Map(state.messageMap);
  const eventProcessed = processEventIntoMap(event, newMessageMap);

  if (!eventProcessed) {
    return state; // No changes needed
  }

  // Rebuild sorted array only when necessary
  const messages = Array.from(newMessageMap.values())
    .filter((item) => item.isMessage())
    .sort((a, b) => (b.originalTs ?? 0) - (a.originalTs ?? 0));

  return {
    messages,
    messageMap: newMessageMap,
    lastProcessedEventId: event.getId(),
  };
}

function processEventIntoMap(
  event: sdk.MatrixEvent,
  messageMap: Map<string, TimelineItem>,
): boolean {
  const type = event.getType();
  const eventId = event.getId();
  if (!eventId) return false;

  const relatesTo = event.getContent()?.["m.relates_to"];

  // Handle edits
  if (
    relatesTo &&
    relatesTo["rel_type"] === "m.replace" &&
    relatesTo["event_id"]
  ) {
    const targetEventId = relatesTo["event_id"];
    const original = messageMap.get(targetEventId);

    if (original && original.isMessage()) {
      // Replace content, preserve original timestamp
      const newItem = TimelineItem.fromMessage(event, original.getTimestamp());
      // Copy over reactions and redacted state
      newItem.reactions = new Map(original.reactions);
      newItem.redacted = original.redacted;
      messageMap.set(targetEventId, newItem);
    } else {
      // Original not found => older than the limit, don't care
      return false;
    }
    return true;
  }

  // Handle reactions
  if (
    relatesTo &&
    relatesTo["rel_type"] === "m.annotation" &&
    relatesTo["event_id"]
  ) {
    const targetEventId = relatesTo["event_id"];
    const target = messageMap.get(targetEventId);

    if (target && target.isMessage()) {
      const key = relatesTo["key"];
      target.addReaction(key || "", event);
      return true;
    }
    return false;
  }

  // Handle redactions
  if (type === "m.room.redaction") {
    // For redaction events, the redacted event ID is in the content
    const redactedEventId = event.getContent().redacts;
    if (redactedEventId) {
      const target = messageMap.get(redactedEventId);
      if (target && target.isMessage()) {
        target.markRedacted();
        return true;
      }
    }
    return false;
  }

  // Handle normal messages
  if (type === "m.room.message") {
    messageMap.set(eventId, TimelineItem.fromMessage(event));
    return true;
  }

  return false;
}
