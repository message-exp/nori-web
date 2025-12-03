import { AlertTriangle, Plus, Users } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";

import ContactCard from "~/components/card-list/contact-card";
import CreateCardDialog from "~/components/card-list/create-card-dialog";
import { getAllContactCards } from "~/lib/contacts-server-api/contacts";
import { getPlatformContacts } from "~/lib/contacts-server-api/platform-contacts";
import type {
  ContactCard as ContactCardType,
  PlatformContact,
} from "~/lib/contacts-server-api/types";
import { Loading } from "../ui/loading";

export default function CardList() {
  const [cards, setCards] = useState<ContactCardType[]>([]);
  const [platformContacts, setPlatformContacts] = useState<
    Record<string, PlatformContact[]>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContactCards = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const contactCards = await getAllContactCards();
      console.log("loading contact cards:", contactCards);
      setCards(contactCards);

      // Load platform contacts for all contact cards
      const platformContactsData: Record<string, PlatformContact[]> = {};
      await Promise.all(
        contactCards.map(async (card) => {
          try {
            const platforms = await getPlatformContacts(card.id);
            platformContactsData[card.id] = platforms;
          } catch (error) {
            console.error(
              `loading contact card ${card.id} platform contact failed:`,
              error,
            );
            platformContactsData[card.id] = [];
          }
        }),
      );
      setPlatformContacts(platformContactsData);
    } catch (error) {
      console.error("Failed to load contact cards:", error);
      setError("Failed to load contact cards. Please try again.");
      setCards([]);
      setPlatformContacts({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContactCards();
  }, []);

  const handleCardCreated = useCallback((newCard: ContactCardType) => {
    setCards((prev) => [...prev, newCard]);
  }, []);

  const handleCardUpdated = useCallback((updatedCard: ContactCardType) => {
    setCards((prev) =>
      prev.map((card) => (card.id === updatedCard.id ? updatedCard : card)),
    );
  }, []);

  const handleCardDeleted = useCallback((deletedCardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== deletedCardId));
  }, []);

  const handlePlatformContactsUpdated = useCallback(
    (cardId: string, updatedPlatformContacts: PlatformContact[]) => {
      setPlatformContacts((prev) => ({
        ...prev,
        [cardId]: updatedPlatformContacts,
      }));
    },
    [],
  );

  const renderContent = () => {
    if (isLoading) {
      return <Loading text="Loading contact cards..." />;
    }

    if (cards.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Users className="size-12" />
            <p className="text-lg font-medium">No contacts yet</p>
            <p className="text-sm text-center">
              Click the "create card" button in the top right to add your first
              contact
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
              onPlatformContactsUpdated={handlePlatformContactsUpdated}
            />
          </div>
        ))}
      </div>
    );
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
        {error && (
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
        )}
        {!error && renderContent()}
      </div>
    </div>
  );
}
