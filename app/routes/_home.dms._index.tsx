import { useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { MergedContactList } from "~/components/merged-contacts/merged-contact-list";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import type { ContactCardWithPlatforms } from "~/hooks/use-contact-cards-with-platforms";

type HomeLayoutContext = {
  isMobile: boolean;
  showMobileList: boolean;
  setShowMobileList: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MergeIndex() {
  const { isMobile, showMobileList, setShowMobileList } =
    useOutletContext<HomeLayoutContext>();
  const [selectedContact, setSelectedContact] =
    useState<ContactCardWithPlatforms | null>(null);

  const handleContactSelect = (contact: ContactCardWithPlatforms) => {
    setSelectedContact(contact);
  };

  const handleBackToList = useCallback(() => {
    setSelectedContact(null);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setShowMobileList(true); // show sidebar on mobile
    }
  }, [isMobile, setShowMobileList]);

  return (
    <div className="h-screen">
      {isMobile ? (
        <div className="h-full w-full transition-all duration-300">
          {!selectedContact ? (
            <MergedContactList
              onContactSelect={handleContactSelect}
              selectedContactId={null}
            />
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 p-4 border-b">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToList}
                  className="shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">
                    {selectedContact?.nickname || selectedContact?.contact_name}
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    {selectedContact?.platformContacts.length} platform
                    {selectedContact?.platformContacts.length !== 1
                      ? "s"
                      : ""}{" "}
                    connected
                  </div>
                </div>
              </div>
              <div className="flex-1 p-4">
                <div className="text-center text-muted-foreground h-full flex items-center justify-center">
                  <div>
                    <div className="text-lg mb-2">Merged Chat Coming Soon</div>
                    <div className="text-sm">
                      Timeline view for{" "}
                      {selectedContact?.nickname ||
                        selectedContact?.contact_name}{" "}
                      will be implemented in Phase 2
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel
            defaultSize={25}
            maxSize={40}
            minSize={20}
            className="flex flex-col"
          >
            <MergedContactList
              onContactSelect={handleContactSelect}
              selectedContactId={selectedContact?.id}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
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
                      Choose a contact from the left to view merged
                      conversations
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
