import { useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { RoomChat } from "~/components/room-chat/room-chat";
import { RoomList } from "~/components/room-list";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { useRoomContext } from "~/contexts/room-context";

type HomeLayoutContext = {
  isMobile: boolean;
  showMobileList: boolean;
  setShowMobileList: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function HomeRoom() {
  const { isMobile, setShowMobileList } = useOutletContext<HomeLayoutContext>();
  const navigate = useNavigate();
  const { room_id } = useParams(); // Get the room_id from URL params
  const { setSelectedRoomId, loading } = useRoomContext();

  // Sync URL param with selected room ID
  useEffect(() => {
    if (room_id) {
      setSelectedRoomId(room_id);
    }
  }, [room_id, setSelectedRoomId]);

  useEffect(() => {
    if (isMobile) {
      setShowMobileList(false); // hide sidebar on mobile
    }
  }, [isMobile, setShowMobileList]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading rooms...
      </div>
    );
  }

  return (
    <div className="h-screen">
      {isMobile ? (
        <div className="h-full w-full transition-all duration-300">
          <RoomChat onBackClick={() => navigate("/home")} />
        </div>
      ) : (
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel
            defaultSize={25}
            maxSize={40}
            className="flex flex-col"
          >
            <RoomList />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <RoomChat />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
