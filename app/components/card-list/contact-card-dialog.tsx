import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { deleteContactCard } from "~/lib/contacts-server-api/contacts";
import type {
  ContactCard as ContactCardType,
  PlatformContact,
} from "~/lib/contacts-server-api/types";
import { useRoomContext } from "~/contexts/room-context";
import { getDMRooms } from "~/lib/dm-room-utils";
import { ContactBasicInfo } from "./contact-basic-info";
import { PlatformContactsList } from "./platform-contacts-list";
import { DeleteConfirmation } from "~/components/ui/delete-confirmation";
import { usePlatformContacts } from "~/hooks/use-platform-contacts";

interface ContactCardDialogProps {
  readonly contactCard: ContactCardType | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onCardUpdated?: (updatedCard: ContactCardType) => void;
  readonly onCardDeleted?: (deletedCardId: string) => void;
  readonly onPlatformContactsUpdated?: (
    cardId: string,
    updatedPlatformContacts: PlatformContact[],
  ) => void;
}

export default function ContactCardDialog({
  contactCard,
  open,
  onOpenChange,
  onCardUpdated,
  onCardDeleted,
  onPlatformContactsUpdated,
}: ContactCardDialogProps) {
  const { rooms } = useRoomContext();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const dmRooms = getDMRooms(rooms);

  const {
    platformContacts,
    isLoading,
    addPlatformContact,
    removePlatformContact,
  } = usePlatformContacts({
    contactCardId: contactCard?.id || "",
    onPlatformContactsUpdated,
    onError: setError,
  });

  useEffect(() => {
    if (contactCard && open) {
      setShowDeleteConfirm(false);
      setError(null);
    }
  }, [contactCard, open]);

  const handleDelete = async () => {
    if (!contactCard) return;

    setIsDeleting(true);
    setError(null);
    try {
      await deleteContactCard(contactCard.id);
      onCardDeleted?.(contactCard.id);
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to delete contact card:", err);
      setError("Failed to delete contact card");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!contactCard) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contact Details</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <ContactBasicInfo
            contactCard={contactCard}
            onCardUpdated={onCardUpdated}
            onError={setError}
          />

          <PlatformContactsList
            platformContacts={platformContacts}
            dmRooms={dmRooms}
            isLoading={isLoading}
            onAddPlatformContact={addPlatformContact}
            onDeletePlatformContact={removePlatformContact}
          />
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <DeleteConfirmation
            showConfirm={showDeleteConfirm}
            isDeleting={isDeleting}
            onShowConfirm={() => setShowDeleteConfirm(true)}
            onConfirmDelete={handleDelete}
            onCancel={() => setShowDeleteConfirm(false)}
            buttonText="Delete Card"
            className="sm:mr-auto"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
