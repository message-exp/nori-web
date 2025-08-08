import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";

import ContactCard from "~/components/card-list/contact-card";
import CreateCardDialog from "~/components/card-list/create-card-dialog";
import type {
  ContactCard as ContactCardType,
  PlatformContact,
  PlatformEnum,
} from "~/lib/contacts-server-api/types";

const mockContactCards: ContactCardType[] = Array.from(
  { length: 12 },
  (_, i) => ({
    id: `contact-${i + 1}`,
    contact_name: `Contact ${i + 1}`,
    nickname: i % 3 === 0 ? `Nick${i + 1}` : undefined,
    contact_avatar_url:
      i % 3 === 1 ? "https://img.senen.dev/IMG_20240704_135615.jpg" : undefined,
  }),
);

const mockPlatformContacts: Record<string, PlatformContact[]> = {
  "contact-1": [
    {
      id: "pc-1",
      contact_card_id: "contact-1",
      platform: "Discord" as PlatformEnum,
      platform_user_id: "user123",
      dm_room_id: "room123",
    },
    {
      id: "pc-2",
      contact_card_id: "contact-1",
      platform: "Telegram" as PlatformEnum,
      platform_user_id: "tg_user123",
      dm_room_id: "tg_room123",
    },
    {
      id: "pc-2-1",
      contact_card_id: "contact-1",
      platform: "Telegram" as PlatformEnum,
      platform_user_id: "tg_user123",
      dm_room_id: "tg_room123",
    },
    {
      id: "pc-2-2",
      contact_card_id: "contact-1",
      platform: "Telegram" as PlatformEnum,
      platform_user_id: "tg_user123",
      dm_room_id: "tg_room123",
    },
  ],
  "contact-2": [
    {
      id: "pc-3",
      contact_card_id: "contact-2",
      platform: "Matrix" as PlatformEnum,
      platform_user_id: "@user:matrix.org",
      dm_room_id: "!room:matrix.org",
    },
  ],
};

interface CardListProps {
  readonly contactCards?: ContactCardType[];
  readonly platformContacts?: Record<string, PlatformContact[]>;
}

export default function CardList({
  contactCards = mockContactCards,
  platformContacts = mockPlatformContacts,
}: CardListProps) {
  const [cards, setCards] = useState<ContactCardType[]>(contactCards);

  const handleCardCreated = (newCard: ContactCardType) => {
    setCards((prev) => [...prev, newCard]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Add Button */}
      <div className="flex justify-end p-4 border-b">
        <CreateCardDialog onCardCreated={handleCardCreated}>
          <Button className="flex items-center gap-2">
            <Plus className="size-4" />
            create card
          </Button>
        </CreateCardDialog>
      </div>

      {/* Scrollable Grid Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div
          className="grid justify-center"
          style={{
            gridTemplateColumns: "repeat(auto-fill, 320px)",
            gap: "16px",
          }}
        >
          {cards.map((contactCard) => (
            <div key={contactCard.id} className="flex justify-center">
              <ContactCard
                contactCard={contactCard}
                platformContacts={platformContacts[contactCard.id] || []}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
