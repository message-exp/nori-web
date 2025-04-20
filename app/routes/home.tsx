import { useEffect, useState } from "react";
import { RoomChat } from "~/components/room-chat";
import { RoomList } from "~/components/room-list";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { useRoomList } from "~/hooks/use-room-list";
import { chats as mockChats } from "~/lib/example"; // 只給 RoomChat 用

export default function Home() {
  const rooms = useRoomList();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  // TODO: 未來roomchat寫好記得拿掉
  const [selectedMockId] = useState<string | null>("1");

  useEffect(() => {
    if (!selectedChat && rooms.length > 0) {
      setSelectedChat(rooms[0].id);
    }
  }, [rooms, selectedChat]);

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={25} maxSize={40} className="flex flex-col">
          <RoomList
            rooms={rooms}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <RoomChat chats={mockChats} selectedChat={selectedMockId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
