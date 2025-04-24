import { Send } from "lucide-react";
import { useState } from "react";
import { client } from "~/lib/matrix-api/client";
import { sendTextMessage } from "~/lib/matrix-api/room-messages";

interface MessageInputProps {
  roomId: string;
}

export function MessageInput({ roomId }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message.trim() || !client.client) return;

    try {
      await sendTextMessage(roomId, message);
      setMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 rounded-md border p-2"
      />
      <button
        onClick={sendMessage}
        className="bg-primary text-primary-foreground px-2 rounded-md"
      >
        <Send />
      </button>
    </div>
  );
}
