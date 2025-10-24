import { BridgeLogin } from "~/components/bridge/bridge-login";
import { ThemeToggle } from "~/components/theme-toggle";

export default function BridgesPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <BridgeLogin className="w-full max-w-2xl" />
      <div className="fixed bottom-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
