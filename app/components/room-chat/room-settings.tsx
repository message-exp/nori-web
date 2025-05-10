import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, DoorOpen, Loader } from "lucide-react";
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
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = React.useState(false);
  const [leaveConfirmation, setLeaveConfirmation] = React.useState("");
  const [isLeaving, setIsLeaving] = React.useState(false);

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

  async function handleLeaveRoom() {
    if (leaveConfirmation !== `leave ${room.name}`) {
      return;
    }

    setIsLeaving(true);
    try {
      // 這裡需要添加刪除房間的API調用
      // await leaveRoom(room.roomId);
      navigate("/home");
    } catch (error) {
      console.error("Failed to leave room:", error);
    } finally {
      setIsLeaving(false);
      setIsLeaveDialogOpen(false);
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
            <div className="flex items-center justify-between border border-destructive/20 rounded-md p-4 mt-2">
              <div className="space-y-1">
                <p className="font-medium">Leave Room</p>
                <p className="text-sm text-muted-foreground">
                  You will no longer have access to this room after leaving.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setIsLeaveDialogOpen(true)}
              >
                <DoorOpen className="h-4 w-4 mr-2" /> Leave Room
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Room</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently Leave the
              room.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-2">
              Please type{" "}
              <span className="font-medium">{`leave ${room.name}`}</span> to
              confirm:
            </p>
            <Input
              value={leaveConfirmation}
              onChange={(e) => setLeaveConfirmation(e.target.value)}
              placeholder={`leave ${room.name}`}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLeaveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLeaveRoom}
              disabled={leaveConfirmation !== `leave ${room.name}` || isLeaving}
            >
              {isLeaving ? (
                <Loader className="animate-spin h-4 w-4 mr-2" />
              ) : (
                <>
                  <DoorOpen className="h-4 w-4 mr-2" /> Leave
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
