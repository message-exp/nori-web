import React, { useState, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { MessageCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import type { DMRoomInfo } from "~/lib/dm-room-utils";
import type { PlatformEnum } from "~/lib/contacts-server-api/types";

interface DMRoomSelectorProps {
  dmRooms: DMRoomInfo[];
  value?: string; // roomId
  onValueChange: (roomInfo: DMRoomInfo | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

function getPlatformIcon(platform: PlatformEnum) {
  switch (platform) {
    case "Discord":
      return (
        <FontAwesomeIcon
          icon={faDiscord}
          className="size-3 text-white"
          aria-label="Discord"
        />
      );
    case "Telegram":
      return (
        <FontAwesomeIcon
          icon={faTelegram}
          className="size-3 text-white"
          aria-label="Telegram"
        />
      );
    case "Matrix":
      return (
        <MessageCircle className="size-3 text-white" aria-label="Matrix" />
      );
    default:
      return null;
  }
}

export function DMRoomSelector({
  dmRooms,
  value,
  onValueChange,
  placeholder = "Select a DM room...",
  disabled = false,
}: DMRoomSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedRoom = useMemo(
    () => dmRooms.find((room) => room.roomId === value),
    [dmRooms, value],
  );

  const filteredRooms = useMemo(() => {
    if (!searchValue) return dmRooms;

    const search = searchValue.toLowerCase();
    return dmRooms.filter(
      (room) =>
        room.roomName.toLowerCase().includes(search) ||
        room.platformUserId?.toLowerCase().includes(search) ||
        room.otherUserId?.toLowerCase().includes(search),
    );
  }, [dmRooms, searchValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedRoom ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="relative">
                <Avatar className="size-6">
                  <AvatarImage
                    src={selectedRoom.roomAvatar}
                    alt={selectedRoom.roomName}
                  />
                  <AvatarFallback className="text-xs">
                    {selectedRoom.roomName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-4 h-4 bg-gray-800 rounded-full ring-1 ring-gray-900">
                  {getPlatformIcon(selectedRoom.platform)}
                </span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="truncate font-medium">
                  {selectedRoom.roomName}
                </div>
                {selectedRoom.platformUserId && (
                  <div className="truncate text-xs text-muted-foreground">
                    {selectedRoom.platformUserId}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Search DM rooms..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>No DM rooms found.</CommandEmpty>
            <CommandGroup>
              {filteredRooms.map((room) => (
                <CommandItem
                  key={room.roomId}
                  value={room.roomId}
                  onSelect={(currentValue) => {
                    const selectedRoom = dmRooms.find(
                      (r) => r.roomId === currentValue,
                    );
                    if (currentValue === value) {
                      onValueChange(null);
                    } else {
                      onValueChange(selectedRoom || null);
                    }
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative">
                      <Avatar className="size-8">
                        <AvatarImage
                          src={room.roomAvatar}
                          alt={room.roomName}
                        />
                        <AvatarFallback className="text-sm">
                          {room.roomName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-4 h-4 bg-gray-800 rounded-full ring-1 ring-gray-900">
                        {getPlatformIcon(room.platform)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">
                        {room.roomName}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">{room.platform}</span>
                        {room.platformUserId && (
                          <span className="truncate">
                            {room.platformUserId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      value === room.roomId ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
