import { Room } from "matrix-js-sdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import RoomSettings from "~/components/room-chat/room-settings";
import RoomSettingsSkeleton from "~/components/room-chat/room-settings-skeleton";
import { checkClientState } from "~/lib/matrix-api/refresh-token";
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

  useEffect(() => {
    const initRoomSetting = async () => {
      const clientState = await checkClientState();
      if (!clientState) {
        console.error("client state is not ok");
        navigate("/login");
        return;
      }
      setRoom(getRoom(params.room_id));
    };
    initRoomSetting();
  }, []);

  if (!room) {
    return (
      <div className="h-screen">
        <RoomSettingsSkeleton roomId={params.room_id} />
      </div>
    );
  }

  return (
    <div className="h-screen">
      <RoomSettings room={room} />
    </div>
  );
}
