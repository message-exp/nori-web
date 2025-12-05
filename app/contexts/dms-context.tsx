import React, { createContext, useContext, useMemo } from "react";
import { useContactCardsWithPlatforms } from "~/hooks/use-contact-cards-with-platforms";
import { useDMRooms } from "~/hooks/use-dm-rooms";
import type { ContactCardWithPlatforms } from "~/hooks/use-contact-cards-with-platforms";
import type { DMRoomInfo } from "~/lib/dm-room-utils";

type DMsContextType = {
  contactCards: ContactCardWithPlatforms[];
  dmRooms: DMRoomInfo[];
  loading: boolean;
  error: string | null;
  refetchContactCards: () => Promise<void>;
};

const DMsContext = createContext<DMsContextType | undefined>(undefined);

export function DMsProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const {
    contactCards,
    loading: contactsLoading,
    error: contactsError,
    refetch,
  } = useContactCardsWithPlatforms();

  const {
    dmRooms,
    loading: dmRoomsLoading,
    error: dmRoomsError,
  } = useDMRooms();

  const loading = contactsLoading || dmRoomsLoading;
  const error = contactsError || dmRoomsError;

  const value = useMemo(
    () => ({
      contactCards,
      dmRooms,
      loading,
      error,
      refetchContactCards: refetch,
    }),
    [contactCards, dmRooms, loading, error, refetch],
  );

  return <DMsContext.Provider value={value}>{children}</DMsContext.Provider>;
}

export function useDMsContext() {
  const context = useContext(DMsContext);
  if (context === undefined) {
    throw new Error("useDMsContext must be used within a DMsProvider");
  }
  return context;
}
