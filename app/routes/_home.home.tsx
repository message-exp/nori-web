import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { RoomChat } from "~/components/room-chat/room-chat";
import { RoomList } from "~/components/room-list";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { useIsMobile } from "~/hooks/use-mobile";

type HomeLayoutContext = {
  isMobile: boolean;
  showMobileList: boolean;
  setShowMobileList: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Home() {
  const { isMobile, showMobileList, setShowMobileList } =
    useOutletContext<HomeLayoutContext>();

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  // const isMobile = useIsMobile();
  // const [showMobileList, setShowMobileList] = useState(true);

  useEffect(() => {
    if (selectedChat) {
      sessionStorage.setItem("selectedChat", selectedChat);
    } else {
      sessionStorage.removeItem("selectedChat");
    }
  }, [selectedChat]);

  // Custom handler for mobile selection that also hides the list
  const handleSelectChat = (roomId: string) => {
    setSelectedChat(roomId);
    if (isMobile) {
      setShowMobileList(false);
    }
  };

  const showMobileLeftPanel = () => {
    if (isMobile) {
      setShowMobileList(true);
    }
  };

  return (
    <div className="h-screen">
      {isMobile ? ( // Mobile Layout - Use non-resizable divs for full width control
        <>
          {showMobileList ? (
            <div className="h-full w-full transition-all duration-300">
              <RoomList
                selectedChat={selectedChat}
                setSelectedChat={handleSelectChat}
              />
            </div>
          ) : (
            <div className="h-full w-full transition-all duration-300">
              <RoomChat
                selectedChat={selectedChat}
                onBackClick={showMobileLeftPanel}
              />
            </div>
          )}
        </>
      ) : (
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel
            defaultSize={25}
            maxSize={40}
            className="flex flex-col"
          >
            <RoomList
              selectedChat={selectedChat}
              setSelectedChat={handleSelectChat}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <RoomChat
              selectedChat={selectedChat}
              onBackClick={showMobileLeftPanel}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
