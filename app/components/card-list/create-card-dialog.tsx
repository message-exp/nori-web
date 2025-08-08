import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Upload } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { ContactCard } from "~/lib/contacts-server-api/types";

const formSchema = z.object({
  contact_name: z.string().min(1, "Display name is required"),
  nickname: z.string().optional(),
  contact_avatar_url: z.string().optional(),
});

interface CreateCardDialogProps {
  children: React.ReactNode;
  onCardCreated: (card: ContactCard) => void;
}

export default function CreateCardDialog({
  children,
  onCardCreated,
}: CreateCardDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact_name: "",
      nickname: "",
      contact_avatar_url: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate 3-second loading
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Create new contact card (simulate success)
      const newCard: ContactCard = {
        id: `contact-${Date.now()}`,
        contact_name: values.contact_name,
        nickname: values.nickname || undefined,
        contact_avatar_url: values.contact_avatar_url || undefined,
      };

      onCardCreated(newCard);
      form.reset();
      setOpen(false);
    } catch {
      setError("Failed to create contact card. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancel = () => {
    form.reset();
    setError(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Contact Card</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Avatar Field */}
              <FormField
                control={form.control}
                name="contact_avatar_url"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Avatar</FormLabel>
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="size-12 rounded-full bg-gray-200 flex items-center justify-center">
                          {field.value ? (
                            <img
                              src={field.value}
                              alt="Avatar preview"
                              className="size-12 rounded-full object-cover"
                            />
                          ) : (
                            <Upload className="size-6 text-gray-400" />
                          )}
                        </div>
                        <FormControl>
                          <Input
                            placeholder="Avatar URL (optional)"
                            className="flex-1"
                            {...field}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <div></div>
                      <FormMessage className="col-span-3" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Display Name Field */}
              <FormField
                control={form.control}
                name="contact_name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">
                        Display Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter display name"
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <div></div>
                      <FormMessage className="col-span-3" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Nickname Field */}
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Nickname</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter nickname (optional)"
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <div></div>
                      <FormMessage className="col-span-3" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Error Message */}
              {error && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div></div>
                  <div className="col-span-3 text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin" /> : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
