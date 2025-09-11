import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { avatarFallback, cn } from "~/lib/utils";
import { PlatformEnum } from "~/lib/contacts-server-api/types";
import type { ContactCardWithPlatforms } from "~/hooks/use-contact-cards-with-platforms";

interface ContactMergeItemProps {
  readonly contact: ContactCardWithPlatforms;
  readonly isSelected: boolean;
  readonly onSelect: () => void;
}

const platformColors = {
  [PlatformEnum.DISCORD]: "bg-indigo-500",
  [PlatformEnum.TELEGRAM]: "bg-blue-500",
  [PlatformEnum.MATRIX]: "bg-green-500",
};

const platformNames = {
  [PlatformEnum.DISCORD]: "Discord",
  [PlatformEnum.TELEGRAM]: "Telegram",
  [PlatformEnum.MATRIX]: "Matrix",
};

export function ContactMergeItem({
  contact,
  isSelected,
  onSelect,
}: ContactMergeItemProps) {
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
              <Badge
                key={platform.id}
                variant="secondary"
                className={cn(
                  "text-xs px-1.5 py-0.5 text-white",
                  platformColors[platform.platform],
                )}
              >
                {platformNames[platform.platform]}
              </Badge>
            ))}
          </div>
        </div>
        <div className="text-sm text-muted-foreground truncate mt-0.5">
          {contact.platformContacts.length} platform
          {contact.platformContacts.length !== 1 ? "s" : ""} connected
        </div>
      </div>
    </button>
  );
}
