import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useTheme } from "~/components/theme-provider";

export function ThemeSelect() {
  const { theme, setTheme } = useTheme();

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger className="w-32 capitalize">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light" className="capitalize">
          Light
        </SelectItem>
        <SelectItem value="dark" className="capitalize">
          Dark
        </SelectItem>
        <SelectItem value="system" className="capitalize">
          System
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
