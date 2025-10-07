import { useState, useEffect, useRef } from "react";
import { getAllContactCards } from "~/lib/contacts-server-api/contacts";
import { getPlatformContacts } from "~/lib/contacts-server-api/platform-contacts";
import type {
  ContactCard,
  PlatformContact,
} from "~/lib/contacts-server-api/types";

export interface ContactCardWithPlatforms extends ContactCard {
  platformContacts: PlatformContact[];
}

// 全域快取，在所有 hook 實例之間共享
let cachedContactCards: ContactCardWithPlatforms[] = [];
let cachePromise: Promise<ContactCardWithPlatforms[]> | null = null;

export function useContactCardsWithPlatforms() {
  const [contactCards, setContactCards] =
    useState<ContactCardWithPlatforms[]>(cachedContactCards);
  const [loading, setLoading] = useState(cachedContactCards.length === 0);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchContactCardsWithPlatforms = async () => {
    // 如果已經有快取，直接返回
    if (cachedContactCards.length > 0) {
      return cachedContactCards;
    }

    // 如果正在載入，等待現有的請求
    if (cachePromise) {
      return cachePromise;
    }

    // 建立新的載入 promise
    cachePromise = (async () => {
      try {
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

        cachedContactCards = filteredCards;
        return filteredCards;
      } catch (error) {
        console.error("Failed to fetch contact cards:", error);
        throw error;
      } finally {
        cachePromise = null;
      }
    })();

    return cachePromise;
  };

  useEffect(() => {
    isMountedRef.current = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchContactCardsWithPlatforms();

        if (isMountedRef.current) {
          setContactCards(data);
        }
      } catch {
        if (isMountedRef.current) {
          setError("Failed to load contacts");
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refetch = async () => {
    cachedContactCards = [];
    cachePromise = null;
    setLoading(true);
    setError(null);

    try {
      const data = await fetchContactCardsWithPlatforms();
      if (isMountedRef.current) {
        setContactCards(data);
      }
    } catch {
      if (isMountedRef.current) {
        setError("Failed to load contacts");
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  return {
    contactCards,
    loading,
    error,
    refetch,
  };
}
