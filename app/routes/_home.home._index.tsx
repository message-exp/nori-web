import { useEffect } from "react";
import { useOutletContext } from "react-router";
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

export default function HomeIndex() {
  const { isMobile, setShowMobileList } = useOutletContext<HomeLayoutContext>();
  const { loading } = useRoomContext();

  useEffect(() => {
    if (isMobile) {
      setShowMobileList(true); // show sidebar on mobile
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
          <RoomList loading={loading} />
        </div>
      ) : (
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel
            defaultSize={25}
            maxSize={40}
            className="flex flex-col"
          >
            <RoomList loading={loading} />
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
