import { useState, useEffect } from "react";
import EmojiPicker, {
  type EmojiClickData,
  Theme as EmojiTheme,
} from "emoji-picker-react";
import { Smile } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useTheme } from "~/components/theme-provider";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function MessageEmojiPicker({
  onEmojiSelect,
}: Readonly<EmojiPickerProps>) {
  const [open, setOpen] = useState(false);
  const { resolvedTheme } = useTheme();

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
  };

  const emojiTheme = (() => {
    switch (resolvedTheme) {
      case "dark":
        return EmojiTheme.DARK;
      case "light":
        return EmojiTheme.LIGHT;
      default:
        return EmojiTheme.LIGHT;
    }
  })();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          aria-label="選擇表情符號"
        >
          <Smile className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="end">
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          width="100%"
          theme={emojiTheme}
          previewConfig={{
            showPreview: false,
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
