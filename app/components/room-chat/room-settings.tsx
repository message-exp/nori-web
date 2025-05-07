import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader } from "lucide-react";
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

const formSchema = z.object({
  name: z.string().min(1),
  topic: z.string().optional(),
});

export default function RoomSettings({ room }: { room: Room }) {
  console.log("RoomSettings", room);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

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
      </Card>
    </div>
  );
}
