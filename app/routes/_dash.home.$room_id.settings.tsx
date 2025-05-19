import { ChevronLeft, Loader2 } from "lucide-react";
import { Room } from "matrix-js-sdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import RoomSettings from "~/components/room-chat/room-settings";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
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
      <div className="h-screen flex items-center justify-center">
        <Card className="w-full sm:w-1/2">
          <CardHeader>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/home")}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          </CardHeader>
          <CardContent className="mb-12">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 text-muted-foreground animate-spin" />
              <h3 className="mt-4 text-lg font-medium">Loading...</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Please wait while we retrieve your settings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <RoomSettings room={room} />
    </div>
  );
}
