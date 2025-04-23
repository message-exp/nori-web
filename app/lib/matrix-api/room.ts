import * as sdk from "matrix-js-sdk";

export function getRoomMessages(room: sdk.Room): sdk.MatrixEvent[] {
  const messages = room
    ?.getLiveTimeline()
    .getEvents()
    .filter((event) => {
      const eventType = event.event.type;
      return eventType === "m.room.message";
    });
  return messages;
}
