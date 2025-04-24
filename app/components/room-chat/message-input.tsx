import { Send } from "lucide-react";
import { useState } from "react";
import { client } from "~/lib/matrix-api/client";
import { sendTextMessage } from "~/lib/matrix-api/room-messages";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface MessageInputProps {
  roomId: string;
}

export function MessageInput({ roomId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || !client.client) return;

    try {
      setLoading(true);
      await sendTextMessage(roomId, message);
      setMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Failed to send message:", error);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
      />
      <Button
        variant="default"
        size="icon"
        disabled={loading}
        onClick={sendMessage}
      >
        <Send />
      </Button>
    </div>
  );
}
