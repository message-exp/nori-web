import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactFormSchema,
  type ContactFormData,
} from "~/lib/contact-dialog-schemas";
import { updateContactCard } from "~/lib/contacts-server-api/contacts";
import type {
  ContactCard as ContactCardType,
  ContactCardUpdate,
} from "~/lib/contacts-server-api/types";

interface UseContactCardFormProps {
  contactCard: ContactCardType;
  onCardUpdated?: (updatedCard: ContactCardType) => void;
  onError?: (error: string) => void;
}

export function useContactCardForm({
  contactCard,
  onCardUpdated,
  onError,
}: UseContactCardFormProps) {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      contact_name: contactCard.contact_name,
      nickname: contactCard.nickname || "",
      contact_avatar_url: contactCard.contact_avatar_url || "",
    },
  });

  const onSubmit = async (values: ContactFormData) => {
    try {
      const updateData: ContactCardUpdate = {
        contact_name: values.contact_name,
        nickname: values.nickname || null,
        contact_avatar_url: values.contact_avatar_url || null,
      };
      const updatedCard = await updateContactCard(contactCard.id, updateData);
      onCardUpdated?.(updatedCard);
      return true;
    } catch (err) {
      console.error("Failed to update contact card:", err);
      onError?.("Failed to update contact card");
      return false;
    }
  };

  const resetForm = () => {
    form.reset({
      contact_name: contactCard.contact_name,
      nickname: contactCard.nickname || "",
      contact_avatar_url: contactCard.contact_avatar_url || "",
    });
  };

  return {
    form,
    onSubmit,
    resetForm,
    isSubmitting: form.formState.isSubmitting,
  };
}
