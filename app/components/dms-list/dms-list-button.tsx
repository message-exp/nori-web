import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { RoomAvatar } from "~/components/ui/room-avatar";
import { avatarFallback, cn } from "~/lib/utils";
import type { ContactCardWithPlatforms } from "~/hooks/use-contact-cards-with-platforms";
import type { DMRoomInfo } from "~/lib/dm-room-utils";
import { BridgeIcon } from "../ui/bridge-icon";

type MergedContactItemProps =
  | {
      itemType: "contact";
      contact: ContactCardWithPlatforms;
      isSelected: boolean;
      onSelect: () => void;
    }
  | {
      itemType: "dmRoom";
      dmRoom: DMRoomInfo;
      isSelected: boolean;
      onSelect: () => void;
    };

export function MergedContactItem(props: Readonly<MergedContactItemProps>) {
  const { isSelected, onSelect } = props;

  const displayName =
    props.itemType === "contact"
      ? props.contact.nickname || props.contact.contact_name
      : props.dmRoom.roomName;

  const renderAvatar = () => {
    if (props.itemType === "contact") {
      return (
        <Avatar className="size-12">
          <AvatarImage src={props.contact.contact_avatar_url || ""} />
          <AvatarFallback>{avatarFallback(displayName)}</AvatarFallback>
        </Avatar>
      );
    } else {
      return (
        <div className="relative">
          <RoomAvatar
            roomId={props.dmRoom.roomId}
            roomName={props.dmRoom.roomName}
            fallbackAvatarUrl={props.dmRoom.roomAvatar}
            className="size-12"
          />
          <div className="absolute -bottom-1 -right-1 size-6 bg-gray-800 rounded-full flex items-center justify-center">
            <BridgeIcon
              platform={props.dmRoom.platform}
              className="size-4 text-white"
              showMatrix={true}
            />
          </div>
        </div>
      );
    }
  };

  const renderPlatformContacts = () => {
    if (props.itemType === "contact") {
      return (
        <div className="flex items-center gap-2 mt-1">
          <div className="flex flex-wrap gap-1">
            {props.contact.platformContacts.map((platform) => (
              <div
                key={platform.id}
                className="flex items-center justify-center size-6 bg-gray-800 rounded-full"
              >
                <BridgeIcon
                  platform={platform.platform}
                  className="size-4 text-white"
                  showMatrix={true}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex items-center gap-3 rounded-lg p-2 text-left",
        isSelected ? "bg-accent" : "hover:bg-muted",
      )}
    >
      <div className="relative">{renderAvatar()}</div>

      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="font-medium">{displayName}</span>
        </div>
        {renderPlatformContacts()}
      </div>
    </button>
  );
}
