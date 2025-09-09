import { useState, useEffect } from "react";
import {
  getPlatformContacts,
  createPlatformContact,
  deletePlatformContact,
} from "~/lib/contacts-server-api/platform-contacts";
import { platformFormSchema } from "~/lib/contact-dialog-schemas";
import type { PlatformContact } from "~/lib/contacts-server-api/types";
import type { DMRoomInfo } from "~/lib/dm-room-utils";

interface UsePlatformContactsProps {
  contactCardId: string;
  onPlatformContactsUpdated?: (
    cardId: string,
    contacts: PlatformContact[],
  ) => void;
  onError?: (error: string) => void;
}

export function usePlatformContacts({
  contactCardId,
  onPlatformContactsUpdated,
  onError,
}: UsePlatformContactsProps) {
  const [platformContacts, setPlatformContacts] = useState<PlatformContact[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const loadPlatformContacts = async () => {
    setIsLoading(true);
    try {
      const contacts = await getPlatformContacts(contactCardId);
      setPlatformContacts(contacts);
      onPlatformContactsUpdated?.(contactCardId, contacts);
    } catch (err) {
      console.error("Failed to load platform contacts:", err);
      onError?.("Failed to load platform contacts");
    } finally {
      setIsLoading(false);
    }
  };

  const addPlatformContact = async (selectedDMRoom: DMRoomInfo) => {
    if (!selectedDMRoom.platformUserId) {
      onError?.("Selected room does not have valid platform information");
      return false;
    }

    const newPlatformContact = {
      platform: selectedDMRoom.platform,
      platform_user_id: selectedDMRoom.platformUserId,
      dm_room_id: selectedDMRoom.roomId,
    };

    const validation = platformFormSchema.safeParse(newPlatformContact);
    if (!validation.success) {
      onError?.("Invalid platform contact data");
      return false;
    }

    try {
      const newContact = await createPlatformContact({
        contact_card_id: contactCardId,
        ...newPlatformContact,
      });
      const updatedPlatformContacts = [...platformContacts, newContact];
      setPlatformContacts(updatedPlatformContacts);
      onPlatformContactsUpdated?.(contactCardId, updatedPlatformContacts);
      return true;
    } catch (err) {
      console.error("Failed to create platform contact:", err);
      onError?.("Failed to create platform contact");
      return false;
    }
  };

  const removePlatformContact = async (platformContactId: string) => {
    try {
      await deletePlatformContact(platformContactId);
      const updatedPlatformContacts = platformContacts.filter(
        (contact) => contact.id !== platformContactId,
      );
      setPlatformContacts(updatedPlatformContacts);
      onPlatformContactsUpdated?.(contactCardId, updatedPlatformContacts);
      return true;
    } catch (err) {
      console.error("Failed to delete platform contact:", err);
      onError?.("Failed to delete platform contact");
      return false;
    }
  };

  useEffect(() => {
    loadPlatformContacts();
  }, [contactCardId]);

  return {
    platformContacts,
    isLoading,
    loadPlatformContacts,
    addPlatformContact,
    removePlatformContact,
  };
}
