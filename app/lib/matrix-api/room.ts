import * as sdk from "matrix-js-sdk";

export function getRoomEvents(room: sdk.Room) {
  // const room = client.client.getRoom(roomId);
  const events = room?.getLiveTimeline().getEvents();
  // TODO: filter event type?
  return events;
}
