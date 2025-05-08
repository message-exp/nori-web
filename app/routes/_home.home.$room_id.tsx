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

type HomeRoomParams = {
  room_id: string;
};

export default function HomeRoom({ params }: { params: HomeRoomParams }) {
  const { isMobile, setShowMobileList } = useOutletContext<HomeLayoutContext>();
  const navigate = useNavigate();
  const selectedChat = params.room_id || null;
  const setSelectedChat = (roomId: string | null) => {
    navigate(`/home/${roomId}`);
  };
  setShowMobileList(false); // hide sidebar on mobile

  return (
    <div className="h-screen">
      {isMobile ? ( // Mobile Layout
        <div className="h-full w-full transition-all duration-300">
          <RoomChat
            selectedChat={selectedChat}
            onBackClick={() => navigate("/home")}
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
