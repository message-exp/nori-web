import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { MessageInputSelector } from "./message-input-selector";
import { MessageEmojiPicker } from "./emoji-picker";
import { client } from "~/lib/matrix-api/client";
import { sendTextMessage } from "~/lib/matrix-api/room-messages";

const formSchema = z.object({
  text: z.string().trim(),
});

interface MessageInputProps {
  roomIds: string[];
}

export function MessageInput({ roomIds }: Readonly<MessageInputProps>) {
  // State for selected room - default to first room
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    roomIds[0] || "",
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

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

  // Sync selectedRoomId with roomIds when they change
  useEffect(() => {
    // When roomIds has data but selectedRoomId is not found, reset to first room
    if (roomIds.length > 0 && !roomIds.includes(selectedRoomId)) {
      setSelectedRoomId(roomIds[0]);
    }
  }, [roomIds, selectedRoomId]);

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

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    const currentText = form.getValues("text");
    form.setValue("text", currentText + emoji);
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
          <MessageEmojiPicker onEmojiSelect={handleEmojiSelect} />
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
