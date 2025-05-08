import { useNavigate, useOutletContext } from "react-router";
import { RoomChat } from "~/components/room-chat/room-chat";
import { RoomList } from "~/components/room-list";
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

export default function HomeIndex() {
  const { isMobile, setShowMobileList } = useOutletContext<HomeLayoutContext>();
  const navigate = useNavigate();
  const selectedChat = null;
  const setSelectedChat = (roomId: string) => {
    navigate(`/home/${roomId}`);
  };
  setShowMobileList(true); // show sidebar on mobile

  return (
    <div className="h-screen">
      {isMobile ? ( // Mobile Layout - Use non-resizable divs for full width control
        <div className="h-full w-full transition-all duration-300">
          <RoomList
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        </div>
      ) : (
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel
            defaultSize={25}
            maxSize={40}
            className="flex flex-col"
          >
            <RoomList
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <RoomChat selectedChat={selectedChat} />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
