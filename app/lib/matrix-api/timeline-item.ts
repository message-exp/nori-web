import * as sdk from "matrix-js-sdk";

// reference: https://github.com/matrix-org/matrix-rust-sdk/blob/main/crates/matrix-sdk-ui/src/timeline/item.rs

export type VirtualType = "date-divider" | "read-marker" | "timeline-start";

export class TimelineItem {
  type: "message" | "virtual";
  event?: sdk.MatrixEvent;
  reactions: Map<string, sdk.MatrixEvent[]>;
  redacted: boolean;
  originalTs?: number;
  virtualType?: VirtualType;
  ts?: number;

  // Message item constructor
  static fromMessage(
    event: sdk.MatrixEvent,
    originalTs?: number,
  ): TimelineItem {
    if (originalTs === undefined) {
      originalTs = event.getTs();
    }
    return new TimelineItem("message", event, new Map(), false, originalTs);
  }

  // Virtual item constructor
  static fromVirtual(virtualType: VirtualType, ts: number): TimelineItem {
    const item = new TimelineItem("virtual");
    item.virtualType = virtualType;
    item.ts = ts;
    return item;
  }

  private constructor(
    type: "message" | "virtual",
    event?: sdk.MatrixEvent,
    reactions: Map<string, sdk.MatrixEvent[]> = new Map(),
    redacted: boolean = false,
    originalTs?: number,
  ) {
    this.type = type;
    this.event = event;
    this.reactions = reactions;
    this.redacted = redacted;
    this.originalTs = originalTs;
  }

  isMessage(): boolean {
    return this.type === "message";
  }

  isVirtual(): boolean {
    return this.type === "virtual";
  }

  isEdited(): boolean {
    if (!this.isMessage() || !this.event) return false;
    const relatesTo = this.event.getContent()?.["m.relates_to"];
    return !!(
      relatesTo &&
      relatesTo["rel_type"] === "m.replace" &&
      relatesTo["event_id"]
    );
  }

  addReaction(key: string, event: sdk.MatrixEvent) {
    if (!this.reactions.has(key)) {
      this.reactions.set(key, []);
    }
    this.reactions.get(key)!.push(event);
  }

  markRedacted() {
    this.redacted = true;
  }

  getTimestamp(): number | undefined {
    if (this.isMessage() && this.event) {
      return this.event.getTs();
    }
    return this.ts;
  }
}
