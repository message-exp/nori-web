import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";

import ContactCard from "~/components/contact-card";
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

export default function CardsPage() {
  const handleAddCard = () => {
    // TODO: 實作新增卡片功能
    console.log("新增卡片");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Add Button */}
      <div className="flex justify-end p-4 border-b">
        <Button onClick={handleAddCard} className="flex items-center gap-2">
          <Plus className="size-4" />
          新增卡片
        </Button>
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
          {mockContactCards.map((contactCard) => (
            <div key={contactCard.id} className="flex justify-center">
              <ContactCard
                contactCard={contactCard}
                platformContacts={mockPlatformContacts[contactCard.id] || []}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
