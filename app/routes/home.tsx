import { useState } from "react";
import { HomeSidebar } from "~/components/home-sidebar";
import { RoomChat } from "~/components/room-chat/room-chat";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";

export default function Home() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={25} maxSize={40} className="flex flex-col">
          <HomeSidebar
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
          {/* <RoomList
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          /> */}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <RoomChat selectedChat={selectedChat} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
