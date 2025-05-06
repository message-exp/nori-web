import { useOutletContext } from "react-router";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";

type HomeLayoutContext = {
  isMobile: boolean;
  showMobileList: boolean;
  setShowMobileList: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Inbox() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isMobile, showMobileList, setShowMobileList } =
    useOutletContext<HomeLayoutContext>();

  // // Custom handler for mobile selection that also hides the list
  // const handleSelectChat = (roomId: string) => {
  //   setSelectedChat(roomId);
  //   if (isMobile) {
  //     setShowMobileList(false);
  //   }
  // };

  // const showMobileLeftPanel = () => {
  //   if (isMobile) {
  //     setShowMobileList(true);
  //   }
  // };

  return (
    <div className="h-screen">
      {isMobile ? ( // Mobile Layout - Use non-resizable divs for full width control
        <>
          {showMobileList ? (
            <div className="h-full w-full transition-all duration-300">
              {/* <RoomList
                selectedChat={selectedChat}
                setSelectedChat={handleSelectChat}
              /> */}
              inbox
            </div>
          ) : (
            <div className="h-full w-full transition-all duration-300">
              {/* <RoomChat
                selectedChat={selectedChat}
                onBackClick={showMobileLeftPanel}
              /> */}
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
            {/* <RoomList
              selectedChat={selectedChat}
              setSelectedChat={handleSelectChat}
            /> */}
            inbox
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            {/* <RoomChat
              selectedChat={selectedChat}
              onBackClick={showMobileLeftPanel}
            /> */}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
