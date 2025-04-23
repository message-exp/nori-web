import { useState } from "react";
import { RoomChat } from "~/components/room-chat/room-chat";
import { RoomList } from "~/components/room-list";
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
    </div>
  );
}
