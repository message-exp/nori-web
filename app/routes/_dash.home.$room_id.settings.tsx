import { MessageSquare } from "lucide-react";
import { Room } from "matrix-js-sdk";
import { useState } from "react";
import { useNavigate } from "react-router";
import RoomSettings from "~/components/room-chat/room-settings";
import { initClient } from "~/lib/matrix-api/init-client";
import { getRoom } from "~/lib/matrix-api/room";

type HomeRoomParams = {
  room_id: string;
};

export default function RoomSettingsPage({
  params,
}: {
  params: HomeRoomParams;
}) {
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);

  initClient(() => {
    setRoom(getRoom(params.room_id));
  });

  if (!room) {
    return (
      <div className="h-screen">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No chat selected</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Select a chat from the sidebar to start messaging
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <RoomSettings room={room} />
    </div>
  );
}
