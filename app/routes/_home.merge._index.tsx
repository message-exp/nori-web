import { useState } from "react";
import { MergedContactList } from "~/components/merged-contacts/merged-contact-list";
import type { ContactCardWithPlatforms } from "~/hooks/use-contact-cards-with-platforms";

export default function MergeIndex() {
  const [selectedContact, setSelectedContact] =
    useState<ContactCardWithPlatforms | null>(null);

  const handleContactSelect = (contact: ContactCardWithPlatforms) => {
    setSelectedContact(contact);
  };

  return (
    <div className="flex flex-row h-full overflow-hidden">
      {/* Left sidebar - Merged Contact List */}
      <div className="w-80 border-r flex-shrink-0">
        <MergedContactList
          onContactSelect={handleContactSelect}
          selectedContactId={selectedContact?.id}
        />
      </div>

      {/* Right side - Merged Chat Interface */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-4">
          {selectedContact ? (
            <div className="h-full">
              <div className="border-b pb-4 mb-4">
                <h2 className="text-xl font-semibold">
                  {selectedContact.nickname || selectedContact.contact_name}
                </h2>
                <div className="text-sm text-muted-foreground">
                  {selectedContact.platformContacts.length} platform
                  {selectedContact.platformContacts.length !== 1
                    ? "s"
                    : ""}{" "}
                  connected
                </div>
              </div>

              <div className="text-center text-muted-foreground">
                <div className="text-lg mb-2">Merged Chat Coming Soon</div>
                <div className="text-sm">
                  Timeline view for{" "}
                  {selectedContact.nickname || selectedContact.contact_name}{" "}
                  will be implemented in Phase 2
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="text-lg mb-2">Select a contact</div>
                <div className="text-sm">
                  Choose a contact from the left to view merged conversations
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
