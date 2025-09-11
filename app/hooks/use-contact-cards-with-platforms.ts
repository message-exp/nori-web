import { useState, useEffect } from "react";
import { getAllContactCards } from "~/lib/contacts-server-api/contacts";
import { getPlatformContacts } from "~/lib/contacts-server-api/platform-contacts";
import type {
  ContactCard,
  PlatformContact,
} from "~/lib/contacts-server-api/types";

export interface ContactCardWithPlatforms extends ContactCard {
  platformContacts: PlatformContact[];
}

export function useContactCardsWithPlatforms() {
  const [contactCards, setContactCards] = useState<ContactCardWithPlatforms[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContactCardsWithPlatforms = async () => {
    try {
      setLoading(true);
      setError(null);

      const allContactCards = await getAllContactCards();

      const contactCardsWithPlatforms: ContactCardWithPlatforms[] =
        await Promise.all(
          allContactCards.map(async (card) => {
            try {
              const platformContacts = await getPlatformContacts(card.id);
              return {
                ...card,
                platformContacts,
              };
            } catch (error) {
              console.error(
                `Failed to fetch platform contacts for card ${card.id}:`,
                error,
              );
              return {
                ...card,
                platformContacts: [],
              };
            }
          }),
        );

      // Only include contact cards that have at least one platform contact
      const filteredCards = contactCardsWithPlatforms.filter(
        (card) => card.platformContacts.length > 0,
      );

      setContactCards(filteredCards);
    } catch (error) {
      console.error("Failed to fetch contact cards:", error);
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactCardsWithPlatforms();
  }, []);

  return {
    contactCards,
    loading,
    error,
    refetch: fetchContactCardsWithPlatforms,
  };
}
