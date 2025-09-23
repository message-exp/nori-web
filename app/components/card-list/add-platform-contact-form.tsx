import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RoomAvatar } from "~/components/ui/room-avatar";
import { DMRoomSelector } from "~/components/ui/dm-room-selector";
import { BridgeIcon } from "~/components/ui/bridge-icon";
import type { DMRoomInfo } from "~/lib/dm-room-utils";

interface AddPlatformContactFormProps {
  readonly dmRooms: DMRoomInfo[];
  readonly onSave: (selectedRoom: DMRoomInfo) => Promise<boolean>;
  readonly onCancel: () => void;
}

export function AddPlatformContactForm({
  dmRooms,
  onSave,
  onCancel,
}: AddPlatformContactFormProps) {
  const [selectedDMRoom, setSelectedDMRoom] = useState<DMRoomInfo | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedDMRoom) return;

    setIsSaving(true);
    try {
      const success = await onSave(selectedDMRoom);
      if (success) {
        setSelectedDMRoom(null);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedDMRoom(null);
    onCancel();
  };

  return (
    <div className="p-3 border rounded-lg space-y-3">
      <div className="space-y-2">
        <Label>Select DM Room</Label>
        <DMRoomSelector
          dmRooms={dmRooms}
          value={selectedDMRoom?.roomId}
          onValueChange={setSelectedDMRoom}
          placeholder="Choose a DM room to add as platform contact..."
        />
      </div>

      {selectedDMRoom && (
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <RoomAvatar
                roomId={selectedDMRoom.roomId}
                roomName={selectedDMRoom.roomName}
                fallbackAvatarUrl={selectedDMRoom.roomAvatar}
                className="size-8"
              />
              <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-4 h-4 bg-gray-800 rounded-full ring-1 ring-gray-900">
                <BridgeIcon
                  platform={selectedDMRoom.platform}
                  className="size-3 text-white"
                  showMatrix={true}
                />
              </span>
            </div>
            <div>
              <div className="font-medium">{selectedDMRoom.roomName}</div>
              <div className="text-sm text-muted-foreground">
                {selectedDMRoom.platform} • {selectedDMRoom.platformUserId}
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Room ID: {selectedDMRoom.roomId}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!selectedDMRoom || isSaving}
        >
          {isSaving ? "Adding..." : "Add Platform"}
        </Button>
        <Button size="sm" variant="outline" onClick={handleCancel}>
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}
