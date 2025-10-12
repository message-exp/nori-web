import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { BridgeIcon } from "~/components/ui/bridge-icon";
import { client } from "~/lib/matrix-api/client";
import { sendTextMessage } from "~/lib/matrix-api/room-messages";
import type { PlatformEnum } from "~/lib/contacts-server-api/types";
import {
  getPlatformBgColor,
  getPlatformDisplayName,
} from "~/lib/platform-styles";

const formSchema = z.object({
  text: z.string().trim(),
});

interface RoomConfig {
  roomId: string;
  platform: PlatformEnum;
  platformUserId?: string;
  platformUserName?: string;
}

interface MessageInputProps {
  roomConfigs: RoomConfig[];
}

export function MessageInput({ roomConfigs }: Readonly<MessageInputProps>) {
  // State for selected room - default to first room
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    roomConfigs[0]?.roomId || "",
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

  // Get current selected room config
  const selectedConfig = roomConfigs.find((rc) => rc.roomId === selectedRoomId);

  // Sync selectedRoomId with roomConfigs when they change
  useEffect(() => {
    // When roomConfigs has data but selectedConfig is not found, reset to first room
    if (roomConfigs.length > 0 && !selectedConfig) {
      setSelectedRoomId(roomConfigs[0].roomId);
    }
  }, [roomConfigs, selectedConfig]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.text || !client.client) return;

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
        {roomConfigs.length > 1 && selectedConfig && (
          <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
            <SelectTrigger className="w-fit min-w-[180px]">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <div
                    className={`size-5 ${getPlatformBgColor(selectedConfig.platform)} rounded-full flex items-center justify-center`}
                  >
                    <BridgeIcon
                      platform={selectedConfig.platform}
                      className="size-3 text-white"
                      showMatrix={true}
                    />
                  </div>
                  <span className="flex items-center gap-1.5">
                    <span>
                      {getPlatformDisplayName(selectedConfig.platform)}
                    </span>
                    {selectedConfig.platformUserName && (
                      <>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">
                          {selectedConfig.platformUserName}
                        </span>
                      </>
                    )}
                  </span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {roomConfigs.map((config) => (
                <SelectItem key={config.roomId} value={config.roomId}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`size-5 ${getPlatformBgColor(config.platform)} rounded-full flex items-center justify-center`}
                    >
                      <BridgeIcon
                        platform={config.platform}
                        className="size-3 text-white"
                        showMatrix={true}
                      />
                    </div>
                    <span className="flex items-center gap-1.5">
                      <span>{getPlatformDisplayName(config.platform)}</span>
                      {config.platformUserName && (
                        <>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-muted-foreground">
                            {config.platformUserName}
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

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
