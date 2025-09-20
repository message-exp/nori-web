import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { avatarFallback, cn } from "~/lib/utils";
import type { ContactCardWithPlatforms } from "~/hooks/use-contact-cards-with-platforms";
import { BridgeIcon } from "../ui/bridge-icon";

interface MergedContactItemProps {
  contact: ContactCardWithPlatforms;
  isSelected: boolean;
  onSelect: () => void;
}

export function MergedContactItem({
  contact,
  isSelected,
  onSelect,
}: Readonly<MergedContactItemProps>) {
  const displayName = contact.nickname || contact.contact_name;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex items-center gap-3 rounded-lg p-2 text-left",
        isSelected ? "bg-accent" : "hover:bg-muted",
      )}
    >
      <div className="relative">
        <Avatar className="size-12">
          <AvatarImage src={contact.contact_avatar_url || ""} />
          <AvatarFallback>{avatarFallback(displayName)}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="font-medium">{displayName}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex flex-wrap gap-1">
            {contact.platformContacts.map((platform) => (
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
      </div>
    </button>
  );
}
