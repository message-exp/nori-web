import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, QrCode, Key } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  getDiscordUserInfo,
  loginWithQr,
  loginWithToken,
  logout,
} from "~/lib/contacts-server-api/bridge/discord";

const discordTokenFormSchema = z.object({
  token: z.string().trim().min(1, "Token is required"),
  tokenType: z.enum(["user", "bot"]),
});

interface DiscordBridgeProps {
  onSuccess?: (message: string | null) => void;
  onError?: (error: string | null) => void;
  onCheckStart?: () => void;
  onCheckComplete?: () => void;
}

export function DiscordBridge({
  onSuccess,
  onError,
  onCheckStart,
  onCheckComplete,
}: DiscordBridgeProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(true);
  const [isConnected, setIsConnected] = React.useState(false);
  const [qrCodeText, setQrCodeText] = React.useState<string | null>(null);
  const [timeLeft, setTimeLeft] = React.useState<number>(0);
  const [isExpired, setIsExpired] = React.useState(false);

  const discordTokenForm = useForm<z.infer<typeof discordTokenFormSchema>>({
    resolver: zodResolver(discordTokenFormSchema),
    defaultValues: {
      token: "",
      tokenType: "user",
    },
  });

  const checkConnection = React.useCallback(async () => {
    setIsChecking(true);
    onCheckStart?.();

    try {
      const response = await getDiscordUserInfo();
      console.log("Discord connection check:", response);
      const connected = response.Discord?.connected ?? false;
      setIsConnected(connected);
    } catch (err) {
      console.error("Failed to check Discord connection:", err);
      setIsConnected(false);
    } finally {
      setIsChecking(false);
      onCheckComplete?.();
    }
  }, [onCheckStart, onCheckComplete]);

  React.useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isActive = true;

    const poll = async () => {
      try {
        const response = await getDiscordUserInfo();
        if (!isActive) return;

        if (response.Discord?.connected) {
          setIsConnected(true);
          setQrCodeText(null);
          onSuccess?.("Successfully connected to Discord!");

          setTimeout(() => {
            window.location.reload();
          }, 1000);
          return;
        }
      } catch (err) {
        if (isActive) {
          console.error("Failed to poll Discord connection status:", err);
        }
      }

      if (isActive) {
        timeoutId = setTimeout(poll, 3000);
      }
    };

    if (qrCodeText && !isConnected && !isExpired) {
      timeoutId = setTimeout(poll, 3000);
    }

    return () => {
      isActive = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [qrCodeText, isConnected, onSuccess, isExpired]);

  React.useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (timeLeft > 0 && !isConnected) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsExpired(true);
            setQrCodeText(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [timeLeft, isConnected]);

  async function handleGenerateQr() {
    setIsLoading(true);
    onError?.(null);
    setQrCodeText(null);
    setIsExpired(false);

    try {
      const response = await loginWithQr();
      console.log("Discord QR code response:", response);

      if (response.code) {
        setQrCodeText(response.code);
        setTimeLeft(response.timeout || 120);
      } else {
        throw new Error(response.error || "Failed to generate QR code");
      }
    } catch (err) {
      onError?.(
        err instanceof Error ? err.message : "Failed to generate QR code",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function onTokenSubmit(values: z.infer<typeof discordTokenFormSchema>) {
    setIsLoading(true);
    onError?.(null);

    try {
      const response = await loginWithToken(values.token, values.tokenType);
      if (response.success) {
        onSuccess?.("Successfully connected to Discord!");
        setIsConnected(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        window.location.reload();
      } else {
        throw new Error(response.error || "Failed to login with token");
      }
    } catch (err) {
      onError?.(
        err instanceof Error ? err.message : "Failed to login with token",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDisconnect() {
    setIsLoading(true);
    onError?.(null);

    try {
      await logout();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsConnected(false);
      onSuccess?.("Successfully disconnected from Discord");
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Failed to disconnect");
    } finally {
      setIsLoading(false);
    }
  }

  if (isChecking) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">
          Checking connection status...
        </span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-muted p-4 space-y-2">
          <p className="text-sm font-medium">Already Connected</p>
          <p className="text-sm text-muted-foreground">
            Your Discord account is already connected to Matrix.
          </p>
        </div>
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleDisconnect}
          disabled={isLoading}
        >
          {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
          Disconnect Discord
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="qr" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="qr">
            <QrCode className="mr-2 h-4 w-4" />
            QR Code
          </TabsTrigger>
          <TabsTrigger value="token">
            <Key className="mr-2 h-4 w-4" />
            Token
          </TabsTrigger>
        </TabsList>

        <TabsContent value="qr" className="space-y-4 pt-4">
          <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8">
            {qrCodeText && !isExpired ? (
              <div className="text-center space-y-4">
                <div className="relative mx-auto bg-background p-2 rounded-lg shadow-sm">
                  <QRCodeSVG
                    value={qrCodeText}
                    size={200}
                    level="L"
                    includeMargin={false}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Scan with Discord App</p>
                  <p className="text-xs text-muted-foreground">
                    Go to User Settings &gt; Scan QR Code
                  </p>
                  <p className="text-xs font-medium text-orange-500">
                    Expires in {timeLeft}s
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateQr}
                  disabled={isLoading}
                >
                  Refresh QR Code
                </Button>
              </div>
            ) : isExpired ? (
              <div className="text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <QrCode className="h-6 w-6 text-muted-foreground opacity-50" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">
                    QR Code Expired
                  </p>
                  <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                    The QR code has expired. Please generate a new one.
                  </p>
                </div>
                <Button onClick={handleGenerateQr} disabled={isLoading}>
                  {isLoading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Refresh QR Code
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <QrCode className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Login with QR Code</p>
                  <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                    Generate a QR code to scan with your Discord mobile app
                  </p>
                </div>
                <Button onClick={handleGenerateQr} disabled={isLoading}>
                  {isLoading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Generate QR Code
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="token" className="space-y-4 pt-4">
          <Form {...discordTokenForm}>
            <form
              onSubmit={discordTokenForm.handleSubmit(onTokenSubmit)}
              className="space-y-4"
            >
              <FormField
                control={discordTokenForm.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord Token</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your Discord token"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Do not share your token with anyone.
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={discordTokenForm.control}
                name="tokenType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select token type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User Account</SelectItem>
                        <SelectItem value="bot">Bot Account</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Login with Token
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
