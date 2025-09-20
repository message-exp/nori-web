import {
  useContactCardsWithPlatforms,
  type ContactCardWithPlatforms,
} from "~/hooks/use-contact-cards-with-platforms";
import { MergedContactItem } from "./dms-list-button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";

interface MergedContactListProps {
  onContactSelect: (contact: ContactCardWithPlatforms) => void;
  selectedContactId?: string | null;
}

export function MergedContactList({
  onContactSelect,
  selectedContactId,
}: Readonly<MergedContactListProps>) {
  const { contactCards, loading, error, refetch } =
    useContactCardsWithPlatforms();

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-r-transparent" />
            <p className="text-sm">Loading contacts...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <button
            onClick={refetch}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      );
    }

    if (contactCards.length === 0) {
      return (
        <div className="p-4 text-sm text-muted-foreground">
          No contacts with platform accounts found.
        </div>
      );
    }

    return contactCards.map((contact) => (
      <MergedContactItem
        key={contact.id}
        contact={contact}
        isSelected={contact.id === selectedContactId}
        onSelect={() => onContactSelect(contact)}
      />
    ));
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 pr-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Merged Contacts</h2>
        </div>
      </div>
      <ScrollArea className="flex-1 h-[calc(100vh-60px)]">
        <div className="flex flex-col gap-1 p-2">{renderContent()}</div>
      </ScrollArea>
    </div>
  );
}
