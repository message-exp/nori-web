import { useState } from "react";
import { RoomChat } from "~/components/room-chat";
import { RoomList } from "~/components/room-list";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { chats } from "~/lib/example";

export default function Home() {
  const [selectedChat, setSelectedChat] = useState<string | null>("1");

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={25} maxSize={40} className="flex flex-col">
          <RoomList
            chats={chats}
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
