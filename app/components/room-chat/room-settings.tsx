import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ArrowLeft, Camera, Loader, LogOut } from "lucide-react";
import type { Room } from "matrix-js-sdk";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Alert, AlertDescription } from "~/components/ui/alert";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "~/components/ui/textarea";
import { getRoomTopic, leaveRoom, updateRoom } from "~/lib/matrix-api/room";

const formSchema = z.object({
  room_name: z.string().min(1),
  room_topic: z.string().optional(),
});

// export function OldRoomSettings({ room }: { room: Room }) {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = React.useState(false);
//   const [isLeaveDialogOpen, setIsLeaveDialogOpen] = React.useState(false);
//   const [leaveConfirmation, setLeaveConfirmation] = React.useState("");
//   const [isLeaving, setIsLeaving] = React.useState(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: room.name || "",
//       topic: getRoomTopic(room) || "",
//     },
//   });

//   function back() {
//     navigate(`/home/${room.roomId}`);
//   }

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     setIsLoading(true);
//     await updateRoom(room.roomId, values.name, values.topic || "");
//     form.reset({
//       name: room.name || "",
//       topic: getRoomTopic(room) || "",
//     });
//     setIsLoading(false);
//     back();
//   }

//   async function handleLeaveRoom() {
//     if (leaveConfirmation !== `leave ${room.name}`) {
//       return;
//     }

//     setIsLeaving(true);
//     try {
//       await leaveRoom(room.roomId);
//       navigate("/home");
//     } catch (error) {
//       console.error("Failed to leave room:", error);
//     } finally {
//       setIsLeaving(false);
//       setIsLeaveDialogOpen(false);
//     }
//   }

//   return (
//     <div className="h-full flex items-center justify-center">
//       <Card className="w-full sm:w-1/2">
//         <CardHeader>
//           <div className="flex flex-row items-center gap-2">
//             <Button variant="ghost" size="icon" onClick={back}>
//               <ChevronLeft className="h-8 w-8" />
//             </Button>
//             <CardTitle>Room Settings</CardTitle>
//           </div>
//         </CardHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//             <CardContent className="flex flex-col gap-4">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-right">Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Room name" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="topic"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-right">Topic</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Optional" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </CardContent>
//             <CardFooter>
//               <Button type="submit" disabled={isLoading}>
//                 {isLoading ? <Loader className="animate-spin" /> : "Save"}
//               </Button>
//             </CardFooter>
//           </form>
//         </Form>

//         <Separator className="my-4" />

//         <CardContent>
//           <div className="space-y-2">
//             <h3 className="text-lg font-medium text-destructive">
//               Danger Zone
//             </h3>
//             <div className="flex items-center justify-between border border-destructive/20 rounded-md p-4 mt-2">
//               <div className="space-y-1">
//                 <p className="font-medium">Leave Room</p>
//                 <p className="text-sm text-muted-foreground">
//                   You will no longer have access to this room after leaving.
//                 </p>
//               </div>
//               <Button
//                 variant="destructive"
//                 onClick={() => setIsLeaveDialogOpen(true)}
//               >
//                 <DoorOpen className="h-4 w-4 mr-2" /> Leave Room
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Leave Room</DialogTitle>
//             <DialogDescription>
//               This action cannot be undone. This will permanently Leave the
//               room.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4">
//             <p className="mb-2">
//               Please type{" "}
//               <span className="font-medium">{`leave ${room.name}`}</span> to
//               confirm:
//             </p>
//             <Input
//               value={leaveConfirmation}
//               onChange={(e) => setLeaveConfirmation(e.target.value)}
//               placeholder={`leave ${room.name}`}
//             />
//           </div>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setIsLeaveDialogOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleLeaveRoom}
//               disabled={leaveConfirmation !== `leave ${room.name}` || isLeaving}
//             >
//               {isLeaving ? (
//                 <Loader className="animate-spin h-4 w-4" />
//               ) : (
//                 <>
//                   <DoorOpen className="h-4 w-4 mr-2" /> Leave
//                 </>
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

export default function RoomSettings({ room }: { room: Room }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = React.useState(false);
  const [leaveConfirmation, setLeaveConfirmation] = React.useState("");
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
    if (leaveConfirmation !== `leave ${room.name}`) {
      return;
    }

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <Button variant="ghost" size="icon" className="mr-2">
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
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsLeaveDialogOpen(true)}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Leave Room
                  </Button>

                  <Dialog
                    open={isLeaveDialogOpen}
                    onOpenChange={setIsLeaveDialogOpen}
                  >
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Leave Room</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          Leave the room.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="mb-2">
                          Please type{" "}
                          <span className="font-medium">{`leave ${room.name}`}</span>{" "}
                          to confirm:
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
                          disabled={
                            leaveConfirmation !== `leave ${room.name}` ||
                            isLeaving
                          }
                        >
                          {isLeaving ? (
                            <Loader className="animate-spin h-4 w-4" />
                          ) : (
                            <>
                              <LogOut className="h-4 w-4 mr-2" /> Leave
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Save Changes */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" type="reset">
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
