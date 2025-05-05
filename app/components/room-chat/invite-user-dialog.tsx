import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import type { Room } from "matrix-js-sdk";
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
import { inviteToRoom } from "~/lib/matrix-api/room";

const formSchema = z.object({
  userId: z
    .string()
    .trim()
    .refine((userId) => /^@[a-z0-9._=\-/+]+:.+/.test(userId), {
      message: "Invalid user ID",
    }),
});

export function InviteUserDialog({
  children,
  room,
}: {
  children: React.ReactNode;
  room: Room;
}) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await inviteToRoom(room.roomId, values.userId);
    form.reset();
    setIsLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Invite to Room</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="@user:matrix.org"
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    {/* <div className="grid grid-cols-4 items-center gap-4">
                      <div></div>
                      <FormDescription className="col-span-3">
                        This is your public display name.
                      </FormDescription>
                    </div> */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <div></div>
                      <FormMessage className="col-span-3" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin" /> : "Invite"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
