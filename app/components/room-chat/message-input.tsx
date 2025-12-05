import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { MessageInputSelector } from "./message-input-selector";
import { client } from "~/lib/matrix-api/client";
import { sendTextMessage } from "~/lib/matrix-api/room-messages";

const formSchema = z.object({
  text: z.string().trim(),
});

interface MessageInputProps {
  roomIds: string[];
  defaultRoomId?: string;
}

export function MessageInput({
  roomIds,
  defaultRoomId,
}: Readonly<MessageInputProps>) {
  // State for selected room - default to defaultRoomId if provided, otherwise first room
  const [selectedRoomId, setSelectedRoomId] = useState<string>(() => {
    if (defaultRoomId && roomIds.includes(defaultRoomId)) {
      return defaultRoomId;
    }
    return roomIds[0] || "";
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  // Track previous roomIds to detect when we switch to a different contact
  const prevRoomIdsRef = useRef<string[]>(roomIds);

  // Helper function to get the preferred room ID (default or first)
  const getPreferredRoomId = useCallback(() => {
    if (defaultRoomId && roomIds.includes(defaultRoomId)) {
      return defaultRoomId;
    }
    return roomIds[0] || "";
  }, [defaultRoomId, roomIds]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  // Watch the text field to update button state
  const text = form.watch("text");

  // Update isEmpty state when text changes
  useEffect(() => {
    setIsEmpty(!text || text.trim() === "");
  }, [text]);

  // Reset to default when switching to a different contact
  useEffect(() => {
    // Check if roomIds changed (switched to different contact)
    const roomIdsChanged =
      prevRoomIdsRef.current.length !== roomIds.length ||
      !prevRoomIdsRef.current.every((id, index) => id === roomIds[index]);

    if (roomIdsChanged) {
      // Update the ref
      prevRoomIdsRef.current = roomIds;

      // Reset to default room or first room
      setSelectedRoomId(getPreferredRoomId());
    }
  }, [roomIds, defaultRoomId, getPreferredRoomId]);

  // Sync selectedRoomId with roomIds when selected room is not in the list
  useEffect(() => {
    // When selectedRoomId is not found in roomIds, reset to default or first room
    if (roomIds.length > 0 && !roomIds.includes(selectedRoomId)) {
      setSelectedRoomId(getPreferredRoomId());
    }
  }, [roomIds, selectedRoomId, getPreferredRoomId]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.text || !client.client || !selectedRoomId) return;

    try {
      setIsLoading(true);
      await sendTextMessage(selectedRoomId, values.text);
      form.reset(); // Clear input after sending
    } catch (error) {
      console.error("Failed to send message:", error);
    }
    setIsLoading(false);
  }

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // capture Shift+Enter to prevent form submission
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        {/* Platform selector - only show if multiple rooms */}
        <MessageInputSelector
          roomIds={roomIds}
          selectedRoomId={selectedRoomId}
          onRoomChange={setSelectedRoomId}
        />

        {/* Message input row */}
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Type a message..."
                    onKeyDown={handleKeyDown}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="default"
            size="icon"
            disabled={isLoading || isEmpty}
          >
            <Send />
          </Button>
        </div>
      </form>
    </Form>
  );
}
