import { AlertCircle } from "lucide-react";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { TelegramBridge } from "~/components/bridge/telegram";

type BridgeType = "discord" | "telegram";

// Bridge 設定列表
const BRIDGES: Array<{
  id: BridgeType;
  name: string;
  icon?: React.ReactNode;
}> = [
  { id: "telegram", name: "Telegram" },
  { id: "discord", name: "Discord" },
];

export function BridgeLogin({
  className,
  props,
}: {
  className?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const [activeBridge, setActiveBridge] =
    React.useState<BridgeType>("telegram");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Reset messages when switching bridges
  React.useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [activeBridge]);

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Bridge Login</CardTitle>
        <CardDescription>
          Connect your Discord or Telegram account to Matrix
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Select Bridge Platform
            </label>
            <Select
              value={activeBridge}
              onValueChange={(v) => setActiveBridge(v as BridgeType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a platform" />
              </SelectTrigger>
              <SelectContent>
                {BRIDGES.map((bridge) => (
                  <SelectItem key={bridge.id} value={bridge.id}>
                    <div className="flex items-center">
                      {bridge.icon && (
                        <span className="mr-2">{bridge.icon}</span>
                      )}
                      {bridge.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            {/* {activeBridge === "discord" && (
              <DiscordBridge onSuccess={setSuccess} onError={setError} />
            )} */}
            {activeBridge === "telegram" && (
              <TelegramBridge onSuccess={setSuccess} onError={setError} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
