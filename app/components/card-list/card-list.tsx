import { AlertTriangle, Plus, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";

import ContactCard from "~/components/card-list/contact-card";
import CreateCardDialog from "~/components/card-list/create-card-dialog";
import { getAllContactCards } from "~/lib/contacts-server-api/contacts";
import type {
  ContactCard as ContactCardType,
  PlatformContact,
} from "~/lib/contacts-server-api/types";

export default function CardList() {
  const [cards, setCards] = useState<ContactCardType[]>([]);
  const [platformContacts] = useState<Record<string, PlatformContact[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContactCards = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const contactCards = await getAllContactCards();
      console.log("載入的 contact cards:", contactCards);
      setCards(contactCards);
    } catch (error) {
      console.error("載入 contact cards 失敗:", error);
      setError("Failed to load contact cards. Please try again.");
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContactCards();
  }, []);

  const handleCardCreated = (newCard: ContactCardType) => {
    setCards((prev) => [...prev, newCard]);
  };

  const handleCardUpdated = (updatedCard: ContactCardType) => {
    setCards((prev) =>
      prev.map((card) => (card.id === updatedCard.id ? updatedCard : card)),
    );
  };

  const handleCardDeleted = (deletedCardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== deletedCardId));
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

          if (error) {
            return (
              <div className="flex items-center justify-center h-full">
                <div className="max-w-md w-full">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={loadContactCards}>
                      Try Again
                    </Button>
                  </div>
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
                    onCardUpdated={handleCardUpdated}
                    onCardDeleted={handleCardDeleted}
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
