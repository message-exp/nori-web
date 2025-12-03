import { useEffect } from "react";
import { useOutletContext } from "react-router";
import type { HomeLayoutContext } from "./_home";
import { RoomChat } from "~/components/room-chat/room-chat";
import { RoomList } from "~/components/room-list/room-list";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { useRoomContext } from "~/contexts/room-context";
import { Loading } from "~/components/ui/loading";

export default function HomeIndex() {
  const { isMobile, setShowMobileList } = useOutletContext<HomeLayoutContext>();
  const { loading } = useRoomContext();

  useEffect(() => {
    if (isMobile) {
      setShowMobileList(true); // show sidebar on mobile
    }
  }, [isMobile, setShowMobileList]);

  if (loading) {
    return <Loading text="Loading rooms..." />;
  }

  return (
    <div className="h-screen">
      {isMobile ? (
        <div className="h-full w-full transition-all duration-300">
          <RoomList />
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
