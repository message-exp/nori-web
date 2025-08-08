import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";

import ContactCard from "~/components/card-list/contact-card";
import type {
  ContactCard as ContactCardType,
  PlatformContact,
} from "~/lib/contacts-server-api/types";

interface CardListProps {
  readonly contactCards: ContactCardType[];
  readonly platformContacts: Record<string, PlatformContact[]>;
  readonly onAddCard?: () => void;
}

export default function CardList({
  contactCards,
  platformContacts,
  onAddCard,
}: CardListProps) {
  const handleAddCard = () => {
    onAddCard?.();
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
          {contactCards.map((contactCard) => (
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
