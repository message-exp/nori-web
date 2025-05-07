import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import type { Room } from "matrix-js-sdk";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useIsMobile } from "~/hooks/use-mobile";
import { getRoomTopic, updateRoom } from "~/lib/matrix-api/room";

const formSchema = z.object({
  name: z.string().min(1),
  topic: z.string().optional(),
});

export default function RoomSettings({ room }: { room: Room }) {
  console.log("RoomSettings", room);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: room.name || "",
      topic: getRoomTopic(room) || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await updateRoom(room.roomId, values.name, values.topic || "");
    form.reset({
      name: room.name || "",
      topic: getRoomTopic(room) || "",
    });
    setIsLoading(false);
    navigate(`/home/${room.roomId}`);
  }

  return (
    <div className="h-screen">
      {isMobile ? ( // Mobile Layout
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <h1 className="text-2xl font-bold">Room Settings</h1>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin" /> : "Save"}
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        // <>
        //   {showMobileList ? (
        //     <div className="h-full w-full transition-all duration-300">
        //       <RoomList
        //         selectedChat={selectedChat}
        //         setSelectedChat={handleSelectChat}
        //       />
        //     </div>
        //   ) : (
        //     <div className="h-full w-full transition-all duration-300">
        //       <RoomChat
        //         selectedChat={selectedChat}
        //         onBackClick={showMobileLeftPanel}
        //       />
        //     </div>
        //   )}
        // </>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <h1 className="text-2xl font-bold">Room Settings</h1>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin" /> : "Save"}
              </Button>
            </form>
          </Form>
        </div>
        // <ResizablePanelGroup direction="horizontal" className="h-full">
        //   <ResizablePanel
        //     defaultSize={25}
        //     maxSize={40}
        //     className="flex flex-col"
        //   >
        //     <RoomList
        //       selectedChat={selectedChat}
        //       setSelectedChat={handleSelectChat}
        //     />
        //   </ResizablePanel>
        //   <ResizableHandle />
        //   <ResizablePanel defaultSize={75}>
        //     <RoomChat
        //       selectedChat={selectedChat}
        //       onBackClick={showMobileLeftPanel}
        //     />
        //   </ResizablePanel>
        // </ResizablePanelGroup>
      )}
    </div>
  );
}
