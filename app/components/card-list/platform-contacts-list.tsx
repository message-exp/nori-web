import { useState } from "react";
import { Plus, MessageCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { BridgeIcon } from "~/components/ui/bridge-icon";
import { DeleteConfirmation } from "~/components/ui/delete-confirmation";
import { AddPlatformContactForm } from "./add-platform-contact-form";
import type { PlatformContact } from "~/lib/contacts-server-api/types";
import type { DMRoomInfo } from "~/lib/dm-room-utils";

interface PlatformContactsListProps {
  readonly platformContacts: PlatformContact[];
  readonly dmRooms: DMRoomInfo[];
  readonly isLoading: boolean;
  readonly onAddPlatformContact: (selectedRoom: DMRoomInfo) => Promise<boolean>;
  readonly onDeletePlatformContact: (contactId: string) => Promise<boolean>;
}

export function PlatformContactsList({
  platformContacts,
  dmRooms,
  isLoading,
  onAddPlatformContact,
  onDeletePlatformContact,
}: PlatformContactsListProps) {
  const [showAddPlatform, setShowAddPlatform] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );
  const [deletingContact, setDeletingContact] = useState<string | null>(null);

  const handleAddPlatform = async (selectedRoom: DMRoomInfo) => {
    const success = await onAddPlatformContact(selectedRoom);
    if (success) {
      setShowAddPlatform(false);
    }
    return success;
  };

  const handleDeleteConfirm = async (contactId: string) => {
    setDeletingContact(contactId);
    const success = await onDeletePlatformContact(contactId);
    setDeletingContact(null);
    if (success) {
      setShowDeleteConfirm(null);
    }
    return success;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Platform Accounts</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddPlatform(true)}
        >
          <Plus className="size-4 mr-2" />
          Add Platform
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-r-transparent" />
        </div>
      ) : (
        <div className="space-y-3">
          {/* Add new platform contact form */}
          {showAddPlatform && (
            <AddPlatformContactForm
              dmRooms={dmRooms}
              onSave={handleAddPlatform}
              onCancel={() => setShowAddPlatform(false)}
            />
          )}

          {/* Platform contacts list */}
          {platformContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-8 bg-gray-800 rounded-full">
                  <BridgeIcon platform={contact.platform} showMatrix={true} />
                </div>
                <div>
                  <p className="font-medium">{contact.platform}</p>
                  <p className="text-sm text-muted-foreground">
                    {contact.platform_user_id}
                  </p>
                </div>
              </div>
              <DeleteConfirmation
                showConfirm={showDeleteConfirm === contact.id}
                isDeleting={deletingContact === contact.id}
                onShowConfirm={() => setShowDeleteConfirm(contact.id)}
                onConfirmDelete={() => handleDeleteConfirm(contact.id)}
                onCancel={() => setShowDeleteConfirm(null)}
                buttonVariant="outline"
                buttonSize="sm"
                showIcon={true}
                className="text-destructive hover:text-destructive"
              />
            </div>
          ))}

          {/* Empty state */}
          {platformContacts.length === 0 && !showAddPlatform && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="size-12 mx-auto mb-3 opacity-50" />
              <p>No platform accounts added yet</p>
              <p className="text-sm">
                Click "Add Platform" to connect accounts
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
