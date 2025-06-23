import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ArrowLeft, Camera, Loader, LogOut } from "lucide-react";
import type { Room } from "matrix-js-sdk";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Textarea } from "~/components/ui/textarea";
import { getRoomTopic, leaveRoom, updateRoom } from "~/lib/matrix-api/room";

const formSchema = z.object({
  room_name: z.string().min(1),
  room_topic: z.string().optional(),
});

export default function RoomSettings({ room }: { room: Room }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = React.useState(false);
  const [isLeaving, setIsLeaving] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      room_name: room.name || "",
      room_topic: getRoomTopic(room) || "",
    },
  });

  function back() {
    navigate(`/home/${room.roomId}`);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await updateRoom(room.roomId, values.room_name, values.room_topic || "");
    form.reset({
      room_name: room.name || "",
      room_topic: getRoomTopic(room) || "",
    });
    setIsLoading(false);
    back();
  }

  async function handleLeaveRoom() {
    setIsLeaving(true);
    try {
      await leaveRoom(room.roomId);
      navigate("/home");
    } catch (error) {
      console.error("Failed to leave room:", error);
    } finally {
      setIsLeaving(false);
      setIsLeaveDialogOpen(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="flex h-14 items-center px-4">
          <Button variant="ghost" size="icon" className="mr-2" onClick={back}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold">Room Settings</h1>
          </div>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="container max-w-4xl mx-auto p-4 space-y-6">
            {/* Room Information */}
            <Card>
              <CardHeader>
                <CardTitle>Room Information</CardTitle>
                <CardDescription>
                  Manage your room's basic information and appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Room Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder.svg?height=80&width=80" />
                      <AvatarFallback className="text-lg">TR</AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Room Photo</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload a photo to personalize your room
                    </p>
                  </div>
                </div>

                {/* Room Name */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="room_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Room name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Room Description */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="room_topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what this room is about..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions that affect this room
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    These actions cannot be undone. Please proceed with caution.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col sm:flex-row gap-3">
                  <AlertDialog
                    open={isLeaveDialogOpen}
                    onOpenChange={setIsLeaveDialogOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex-1">
                        <LogOut className="h-4 w-4 mr-2" />
                        Leave Room
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. You will permanently
                          leave the room and will not be accessible to all
                          messages, files, and member data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={isLeaving}
                          onClick={(e) => {
                            e.preventDefault();
                            handleLeaveRoom();
                          }}
                        >
                          {isLeaving ? (
                            <>
                              <Loader className="h-4 w-4 animate-spin" />
                              Leave Room
                            </>
                          ) : (
                            <>
                              <LogOut className="h-4 w-4" />
                              Leave Room
                            </>
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>

            {/* Save Changes */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" type="reset" onClick={back}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader className="animate-spin" />
                    Saving Changes
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
