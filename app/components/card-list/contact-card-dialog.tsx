import { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  AlertTriangle,
  Plus,
  X,
  MessageCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  updateContactCard,
  deleteContactCard,
} from "~/lib/contacts-server-api/contacts";
import {
  getPlatformContacts,
  createPlatformContact,
  deletePlatformContact,
} from "~/lib/contacts-server-api/platform-contacts";
import type {
  ContactCard as ContactCardType,
  PlatformContact,
  ContactCardUpdate,
} from "~/lib/contacts-server-api/types";
import { useRoomContext } from "~/contexts/room-context";
import { getDMRooms, type DMRoomInfo } from "~/lib/dm-room-utils";
import { DMRoomSelector } from "~/components/ui/dm-room-selector";
import { PlatformIcon } from "~/components/ui/bridge-icon";

interface ContactCardDialogProps {
  readonly contactCard: ContactCardType | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onCardUpdated?: (updatedCard: ContactCardType) => void;
  readonly onCardDeleted?: (deletedCardId: string) => void;
}

const contactFormSchema = z.object({
  contact_name: z.string().min(1, "Display name is required"),
  nickname: z.string().optional(),
  contact_avatar_url: z.string().optional(),
});

const platformFormSchema = z.object({
  platform: z.enum(["Discord", "Telegram", "Matrix"]),
  platform_user_id: z.string().min(1, "Platform user ID is required"),
  dm_room_id: z.string().min(1, "DM room ID is required"),
});

export default function ContactCardDialog({
  contactCard,
  open,
  onOpenChange,
  onCardUpdated,
  onCardDeleted,
}: ContactCardDialogProps) {
  const { rooms } = useRoomContext();
  const [isEditing, setIsEditing] = useState(false);
  const [platformContacts, setPlatformContacts] = useState<PlatformContact[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeletePlatformConfirm, setShowDeletePlatformConfirm] = useState<
    string | null
  >(null);
  const [selectedDMRoom, setSelectedDMRoom] = useState<DMRoomInfo | null>(null);
  const [showAddPlatform, setShowAddPlatform] = useState(false);

  const dmRooms = getDMRooms(rooms);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      contact_name: "",
      nickname: "",
      contact_avatar_url: "",
    },
  });

  useEffect(() => {
    if (contactCard && open) {
      setIsEditing(false); // Reset edit state when opening dialog
      setShowDeleteConfirm(false); // Reset delete confirm state when opening dialog
      setShowDeletePlatformConfirm(null); // Reset delete platform confirm state when opening dialog
      setShowAddPlatform(false); // Reset add platform form when opening dialog
      setSelectedDMRoom(null); // Reset selected DM room when opening dialog
      form.reset({
        contact_name: contactCard.contact_name,
        nickname: contactCard.nickname || "",
        contact_avatar_url: contactCard.contact_avatar_url || "",
      });
      loadPlatformContacts();
    }
  }, [contactCard, open, form]);

  const loadPlatformContacts = async () => {
    if (!contactCard) return;

    setIsLoading(true);
    setError(null);
    try {
      const contacts = await getPlatformContacts(contactCard.id);
      setPlatformContacts(contacts);
    } catch (err) {
      console.error("Failed to load platform contacts:", err);
      setError("Failed to load platform contacts");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof contactFormSchema>) => {
    if (!contactCard) return;

    setError(null);
    try {
      const updateData: ContactCardUpdate = {
        contact_name: values.contact_name,
        nickname: values.nickname || null,
        contact_avatar_url: values.contact_avatar_url || null,
      };
      const updatedCard = await updateContactCard(contactCard.id, updateData);
      onCardUpdated?.(updatedCard);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update contact card:", err);
      setError("Failed to update contact card");
    }
  };

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

  const handleAddPlatformContact = () => {
    setShowAddPlatform(true);
    setSelectedDMRoom(null);
  };

  const handleSaveNewPlatformContact = async () => {
    if (!contactCard || !selectedDMRoom) return;

    if (!selectedDMRoom.platformUserId) {
      setError("Selected room does not have valid platform information");
      return;
    }

    const newPlatformContact = {
      platform: selectedDMRoom.platform,
      platform_user_id: selectedDMRoom.platformUserId,
      dm_room_id: selectedDMRoom.roomId,
    };

    const validation = platformFormSchema.safeParse(newPlatformContact);
    if (!validation.success) {
      setError("Invalid platform contact data");
      return;
    }

    setError(null);
    try {
      const newContact = await createPlatformContact({
        contact_card_id: contactCard.id,
        ...newPlatformContact,
      });
      setPlatformContacts((prev) => [...prev, newContact]);
      setShowAddPlatform(false);
      setSelectedDMRoom(null);
    } catch (err) {
      console.error("Failed to create platform contact:", err);
      setError("Failed to create platform contact");
    }
  };

  const handleDeletePlatformContact = async (platformContactId: string) => {
    setError(null);
    try {
      await deletePlatformContact(platformContactId);
      setPlatformContacts((prev) =>
        prev.filter((contact) => contact.id !== platformContactId),
      );
      setShowDeletePlatformConfirm(null);
    } catch (err) {
      console.error("Failed to delete platform contact:", err);
      setError("Failed to delete platform contact");
    }
  };

  if (!contactCard) return null;

  const displayName = contactCard.contact_name || "Contact Name";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            Contact Details
            <div className="flex gap-2">
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="size-4" />
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-6">
            <Avatar className="size-24">
              <AvatarImage
                src={contactCard.contact_avatar_url || undefined}
                alt={displayName}
              />
              <AvatarFallback className="text-3xl font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              {isEditing ? (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="contact_avatar_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Avatar</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Avatar URL (optional)"
                              disabled
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contact_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter display name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nickname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nickname</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter nickname (optional)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting
                          ? "Saving..."
                          : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-2">
                  <div>
                    <h2 className="text-2xl font-semibold">{displayName}</h2>
                    {contactCard.nickname && (
                      <p className="text-lg text-muted-foreground">
                        {contactCard.nickname}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Platform Contacts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Platform Accounts</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddPlatformContact}
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
                  <div className="p-3 border rounded-lg space-y-3">
                    <div className="space-y-2">
                      <Label>Select DM Room</Label>
                      <DMRoomSelector
                        dmRooms={dmRooms}
                        value={selectedDMRoom?.roomId}
                        onValueChange={setSelectedDMRoom}
                        placeholder="Choose a DM room to add as platform contact..."
                      />
                    </div>

                    {selectedDMRoom && (
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="relative">
                            <Avatar className="size-8">
                              <AvatarImage
                                src={selectedDMRoom.roomAvatar}
                                alt={selectedDMRoom.roomName}
                              />
                              <AvatarFallback className="text-sm">
                                {selectedDMRoom.roomName
                                  .charAt(0)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-4 h-4 bg-gray-800 rounded-full ring-1 ring-gray-900">
                              <PlatformIcon
                                platform={selectedDMRoom.platform}
                                className="size-3 text-white"
                              />
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">
                              {selectedDMRoom.roomName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {selectedDMRoom.platform} •{" "}
                              {selectedDMRoom.platformUserId}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Room ID: {selectedDMRoom.roomId}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveNewPlatformContact}
                        disabled={!selectedDMRoom}
                      >
                        Add Platform
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowAddPlatform(false);
                          setSelectedDMRoom(null);
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {platformContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-8 bg-gray-800 rounded-full">
                        <PlatformIcon platform={contact.platform} />
                      </div>
                      <div>
                        <p className="font-medium">{contact.platform}</p>
                        <p className="text-sm text-muted-foreground">
                          {contact.platform_user_id}
                        </p>
                      </div>
                    </div>
                    {showDeletePlatformConfirm !== contact.id ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeletePlatformConfirm(contact.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    ) : (
                      <div className="flex gap-1">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleDeletePlatformContact(contact.id)
                          }
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDeletePlatformConfirm(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

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
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {!showDeleteConfirm ? (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              className="sm:mr-auto"
            >
              <Trash2 className="size-4 mr-2" />
              Delete Card
            </Button>
          ) : (
            <div className="flex gap-2 sm:mr-auto">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
