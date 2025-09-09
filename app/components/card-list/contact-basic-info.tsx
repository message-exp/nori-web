import { useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useContactCardForm } from "~/hooks/use-contact-card-form";
import { avatarFallback } from "~/lib/utils";
import type { ContactCard as ContactCardType } from "~/lib/contacts-server-api/types";

interface ContactBasicInfoProps {
  readonly contactCard: ContactCardType;
  readonly onCardUpdated?: (updatedCard: ContactCardType) => void;
  readonly onError?: (error: string) => void;
}

export function ContactBasicInfo({
  contactCard,
  onCardUpdated,
  onError,
}: ContactBasicInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { form, onSubmit, resetForm, isSubmitting } = useContactCardForm({
    contactCard,
    onCardUpdated,
    onError,
  });

  const displayName = contactCard.contact_name || "Contact Name";

  const handleSubmit = async (values: Parameters<typeof onSubmit>[0]) => {
    const success = await onSubmit(values);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-6">
      <Avatar className="size-24">
        <AvatarImage
          src={contactCard.contact_avatar_url || undefined}
          alt={displayName}
        />
        <AvatarFallback className="text-3xl font-semibold">
          {avatarFallback(displayName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-4">
        {isEditing ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
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
                    <FormLabel>
                      Display Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter display name"
                        maxLength={100}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="text-xs text-muted-foreground text-right mt-1">
                      {field.value?.length || 0}/100
                    </div>
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
                        maxLength={50}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="text-xs text-muted-foreground text-right mt-1">
                      {field.value?.length || 0}/50
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{displayName}</h2>
                {contactCard.nickname && (
                  <p className="text-lg text-muted-foreground">
                    {contactCard.nickname}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
