import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { PlatformIcon } from "~/components/ui/bridge-icon";
import ContactCardDialog from "~/components/card-list/contact-card-dialog";
import type {
  ContactCard as ContactCardType,
  PlatformContact,
} from "~/lib/contacts-server-api/types";

interface ContactCardProps {
  readonly contactCard?: ContactCardType;
  readonly platformContacts?: PlatformContact[];
  readonly onCardUpdated?: (updatedCard: ContactCardType) => void;
  readonly onCardDeleted?: (deletedCardId: string) => void;
  readonly onPlatformContactsUpdated?: (
    cardId: string,
    updatedPlatformContacts: PlatformContact[],
  ) => void;
}

export default function ContactCard({
  contactCard,
  platformContacts = [],
  onCardUpdated,
  onCardDeleted,
  onPlatformContactsUpdated,
}: ContactCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const displayName = contactCard?.contact_name || "Contact Name";
  const nickname = contactCard?.nickname;

  const handleCardClick = () => {
    if (contactCard) {
      setDialogOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        className="w-80 h-54 border rounded-lg shadow-sm bg-card transition-transform duration-300 ease-out cursor-pointer hover:scale-105 p-0 text-left"
        onClick={handleCardClick}
        aria-label={`View details for ${displayName}`}
      >
        <div className="flex items-center p-6 h-full">
          {/* Large Avatar */}
          <div className="flex-shrink-0 mr-6">
            <Avatar className="size-20">
              <AvatarImage
                src={contactCard?.contact_avatar_url || undefined}
                alt={displayName}
              />
              <AvatarFallback className="text-2xl font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Contact Info and Platform Icons */}
          <div className="flex-1 min-w-0">
            {/* display name and nickname */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-foreground truncate">
                {displayName}
              </h3>
              {nickname && (
                <p className="text-sm text-muted-foreground truncate">
                  {nickname}
                </p>
              )}
            </div>

            {/* Platform Icons */}
            <div className="flex gap-2">
              {platformContacts.slice(0, 3).map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-center size-8 bg-gray-800 rounded-full"
                >
                  <PlatformIcon platform={contact.platform} />
                </div>
              ))}
              {platformContacts.length > 3 && (
                <div className="flex items-center justify-center size-8 bg-muted rounded-full">
                  <span className="text-xs text-muted-foreground">
                    +{platformContacts.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </button>

      <ContactCardDialog
        contactCard={contactCard || null}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCardUpdated={onCardUpdated}
        onCardDeleted={onCardDeleted}
        onPlatformContactsUpdated={onPlatformContactsUpdated}
      />
    </>
  );
}
