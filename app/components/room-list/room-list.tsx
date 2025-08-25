import { DialogTrigger } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useRoomContext } from "~/contexts/room-context";
import { CreateRoomDialog } from "./create-room-dialog";
import { RoomListButton } from "./room-list-button";
interface RoomListProps {
  readonly onRoomSelect?: (roomId: string) => void;
}

export const RoomList = React.memo(({ onRoomSelect }: RoomListProps) => {
  const { rooms, selectedRoomId, setSelectedRoomId } = useRoomContext();
  const navigate = useNavigate();

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
    if (onRoomSelect) {
      onRoomSelect(roomId);
    } else {
      navigate(`/home/${roomId}`);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 pr-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Messages</h2>
          <CreateRoomDialog>
            <TooltipProvider>
              <Tooltip>
                <DialogTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Plus />
                    </Button>
                  </TooltipTrigger>
                </DialogTrigger>
                <TooltipContent>
                  <p>Create room</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CreateRoomDialog>
        </div>
      </div>
      <ScrollArea className="flex-1 h-[calc(100vh-60px)]">
        <div className="flex flex-col gap-1 p-2">
          {rooms.map((room) => (
            <RoomListButton
              key={room.roomId}
              room={room}
              selectedRoomId={selectedRoomId}
              onRoomSelect={handleRoomSelect}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
});
