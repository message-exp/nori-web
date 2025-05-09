import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader, Trash2 } from "lucide-react";
import type { Room } from "matrix-js-sdk";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { getRoomTopic, updateRoom } from "~/lib/matrix-api/room";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const formSchema = z.object({
  name: z.string().min(1),
  topic: z.string().optional(),
});

export default function RoomSettings({ room }: { room: Room }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: room.name || "",
      topic: getRoomTopic(room) || "",
    },
  });

  function back() {
    navigate(`/home/${room.roomId}`);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await updateRoom(room.roomId, values.name, values.topic || "");
    form.reset({
      name: room.name || "",
      topic: getRoomTopic(room) || "",
    });
    setIsLoading(false);
    back();
  }

  async function handleDeleteRoom() {
    if (deleteConfirmation !== `delete ${room.name}`) {
      return;
    }

    setIsDeleting(true);
    try {
      // 這裡需要添加刪除房間的API調用
      // await deleteRoom(room.roomId);
      navigate("/home");
    } catch (error) {
      console.error("Failed to delete room:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  }

  return (
    <div className="h-full flex items-center justify-center">
      <Card className="w-full sm:w-1/2">
        <CardHeader>
          <div className="flex flex-row items-center gap-2">
            <Button variant="ghost" size="icon" onClick={back}>
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <CardTitle>Room Settings</CardTitle>
          </div>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Room name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin" /> : "Save"}
              </Button>
            </CardFooter>
          </form>
        </Form>

        <Separator className="my-4" />

        <CardContent>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-destructive">
              Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground">
              Once you delete a room, there is no going back. Please be certain.
            </p>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="w-full mt-2"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete Room
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              room.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-2">
              Please type{" "}
              <span className="font-medium">{`delete ${room.name}`}</span> to
              confirm:
            </p>
            <Input
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder={`delete ${room.name}`}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRoom}
              disabled={
                deleteConfirmation !== `delete ${room.name}` || isDeleting
              }
            >
              {isDeleting ? (
                <Loader className="animate-spin h-4 w-4 mr-2" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
