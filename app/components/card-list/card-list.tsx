import { Plus, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";

import ContactCard from "~/components/card-list/contact-card";
import CreateCardDialog from "~/components/card-list/create-card-dialog";
import { getAllContactCards } from "~/lib/contacts-server-api/contacts";
import type {
  ContactCard as ContactCardType,
  PlatformContact,
  PlatformEnum,
} from "~/lib/contacts-server-api/types";

// Mock data - commented out but kept for reference
// const mockContactCards: ContactCardType[] = Array.from(
//   { length: 12 },
//   (_, i) => ({
//     id: `contact-${i + 1}`,
//     contact_name: `Contact ${i + 1}`,
//     nickname: i % 3 === 0 ? `Nick${i + 1}` : undefined,
//     contact_avatar_url:
//       i % 3 === 1 ? "https://img.senen.dev/IMG_20240704_135615.jpg" : undefined,
//   }),
// );

// const mockPlatformContacts: Record<string, PlatformContact[]> = {
//   "contact-1": [
//     {
//       id: "pc-1",
//       contact_card_id: "contact-1",
//       platform: "Discord" as PlatformEnum,
//       platform_user_id: "user123",
//       dm_room_id: "room123",
//     },
//     {
//       id: "pc-2",
//       contact_card_id: "contact-1",
//       platform: "Telegram" as PlatformEnum,
//       platform_user_id: "tg_user123",
//       dm_room_id: "tg_room123",
//     },
//     {
//       id: "pc-2-1",
//       contact_card_id: "contact-1",
//       platform: "Telegram" as PlatformEnum,
//       platform_user_id: "tg_user123",
//       dm_room_id: "tg_room123",
//     },
//     {
//       id: "pc-2-2",
//       contact_card_id: "contact-1",
//       platform: "Telegram" as PlatformEnum,
//       platform_user_id: "tg_user123",
//       dm_room_id: "tg_room123",
//     },
//   ],
//   "contact-2": [
//     {
//       id: "pc-3",
//       contact_card_id: "contact-2",
//       platform: "Matrix" as PlatformEnum,
//       platform_user_id: "@user:matrix.org",
//       dm_room_id: "!room:matrix.org",
//     },
//   ],
// };

export default function CardList() {
  const [cards, setCards] = useState<ContactCardType[]>([]);
  const [platformContacts, setPlatformContacts] = useState<
    Record<string, PlatformContact[]>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContactCards = async () => {
      setIsLoading(true);
      try {
        const contactCards = await getAllContactCards();
        console.log("載入的 contact cards:", contactCards);
        setCards(contactCards);
      } catch (error) {
        console.error("載入 contact cards 失敗:", error);
        setCards([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadContactCards();
  }, []);

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
        {(() => {
          if (isLoading) {
            return (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-r-transparent" />
                  <p className="text-sm">loading...</p>
                </div>
              </div>
            );
          }

          if (cards.length === 0) {
            return (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Users className="size-12" />
                  <p className="text-lg font-medium">No contacts yet</p>
                  <p className="text-sm text-center">
                    Click the "create card" button in the top right to add your
                    first contact
                  </p>
                </div>
              </div>
            );
          }

          return (
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
          );
        })()}
      </div>
    </div>
  );
}
