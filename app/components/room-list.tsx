import { DialogTrigger } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import React from "react";
import { CreateRoomDialog } from "~/components/create-room-dialog";
import {
  RoomListItem,
  RoomListItemSkeleton,
} from "~/components/room-list-item";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useRoomContext } from "~/contexts/room-context";

interface RoomListProps {
  readonly loading?: boolean;
}

export const RoomList = React.memo(({ loading }: RoomListProps) => {
  const { rooms } = useRoomContext();

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
          {/* loading */}
          {loading &&
            ((n) => {
              const elements = [];
              for (let i = 0; i < n; i++) {
                elements.push(<RoomListItemSkeleton key={i} />);
              }
              return elements;
            })(10)}
          {/* no room */}
          {!loading && rooms.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">
                No rooms available
              </p>
            </div>
          )}
          {/* has room */}
          {!loading &&
            rooms.map((room) => <RoomListItem key={room.roomId} room={room} />)}
        </div>
      </ScrollArea>
    </div>
  );
});
