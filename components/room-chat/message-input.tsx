import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { client } from "@/lib/matrix-api/client";
import { sendTextMessage } from "@/lib/matrix-api/room-messages";

const formSchema = z.object({
  text: z.string().trim(),
});

interface MessageInputProps {
  roomId: string;
}

export function MessageInput({ roomId }: MessageInputProps) {
  // const [message, setMessage] = useState("");
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.text || !client.client) return;

    try {
      setIsLoading(true);
      await sendTextMessage(roomId, values.text);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
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
      </form>
    </Form>
  );
}
