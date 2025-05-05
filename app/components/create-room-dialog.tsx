import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
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
import { createRoom } from "~/lib/matrix-api/room";

const formSchema = z.object({
  name: z.string().min(1),
  topic: z.string().optional(),
});

export function CreateRoomDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      topic: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await createRoom({ name: values.name, topic: values.topic });
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
              <DialogTitle>Create a room</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Room name"
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
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Topic</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Optional"
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
                {isLoading ? <Loader className="animate-spin" /> : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
