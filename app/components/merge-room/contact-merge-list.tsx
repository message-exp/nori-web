import {
  useContactCardsWithPlatforms,
  type ContactCardWithPlatforms,
} from "~/hooks/use-contact-cards-with-platforms";
import { ContactMergeItem } from "./contact-merge-item";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";

interface ContactMergeListProps {
  readonly onContactSelect: (contact: ContactCardWithPlatforms) => void;
  readonly selectedContactId?: string | null;
}

export function ContactMergeList({
  onContactSelect,
  selectedContactId,
}: ContactMergeListProps) {
  const { contactCards, loading, error, refetch } =
    useContactCardsWithPlatforms();

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 pr-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Merged Contacts</h2>
          <span className="text-sm text-muted-foreground">
            {loading ? "..." : contactCards.length}
          </span>
        </div>
      </div>
      <ScrollArea className="flex-1 h-[calc(100vh-60px)]">
        <div className="flex flex-col gap-1 p-2">
          {loading ? (
            <div className="p-4 text-sm text-muted-foreground">
              Loading contacts...
            </div>
          ) : error ? (
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
          ) : contactCards.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              No contacts with platform accounts found.
            </div>
          ) : (
            contactCards.map((contact) => (
              <ContactMergeItem
                key={contact.id}
                contact={contact}
                isSelected={contact.id === selectedContactId}
                onSelect={() => onContactSelect(contact)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
