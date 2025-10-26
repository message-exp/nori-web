"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, QrCode } from "lucide-react";
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
import {
  loginWithQr,
  getDiscordUserInfo,
  logoutDiscordBridge,
} from "~/lib/contacts-server-api/bridge/discord";
import { QRCodeSVG } from "qrcode.react";
// Discord Login Form Schema
const discordTokenFormSchema = z.object({
  token: z.string().trim().min(1, "Token is required"),
  tokenType: z.enum(["bot", "oauth", "user"]),
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
  const [userInfo, setUserInfo] = React.useState<any>(null);
  const [qrCode, setQrCode] = React.useState<string | null>(null);

  // Discord Token Form
  const discordTokenForm = useForm<z.infer<typeof discordTokenFormSchema>>({
    resolver: zodResolver(discordTokenFormSchema),
    defaultValues: {
      token: "",
      tokenType: "bot",
    },
  });

  // Check if user is already connected to Discord
  React.useEffect(() => {
    async function checkConnection() {
      setIsChecking(true);
      onCheckStart?.();

      try {
        const response = await getDiscordUserInfo();
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const logged_in = response.Discord.logged_in;

        if (logged_in) {
          const discordUserInfo = {
            userId: response.mxid,
            // 可以根據實際 API response 調整欄位
          };

          setIsConnected(true);
          setUserInfo(discordUserInfo);
          onSuccess?.("Already connected to Discord");
        } else {
          setIsConnected(false);
          setUserInfo(null);
        }
      } catch (err) {
        console.error("Failed to check Discord connection:", err);
        setIsConnected(false);
        setUserInfo(null);
      } finally {
        setIsChecking(false);
        onCheckComplete?.();
      }
    }

    checkConnection();
  }, []);

  // Discord QR Code Login
  async function onDiscordQRLogin() {
    setIsLoading(true);
    onError?.(null);
    onSuccess?.(null);
    setQrCode(null);

    try {
      const response = await loginWithQr();
      console.log(response);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setQrCode(response.code);
      onSuccess?.("Scan the QR code with Discord mobile app");
    } catch (err) {
      onError?.(
        err instanceof Error ? err.message : "Failed to generate QR code",
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Discord Token Login
  async function onDiscordTokenSubmit(
    values: z.infer<typeof discordTokenFormSchema>,
  ) {
    setIsLoading(true);
    onError?.(null);
    onSuccess?.(null);

    try {
      // TODO: Replace with actual API call
      // const response = await loginWithToken(values);

      // Simulated response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSuccess?.("Successfully connected to Discord!");
      discordTokenForm.reset();
    } catch (err) {
      onError?.(
        err instanceof Error ? err.message : "Failed to login with token",
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Handle disconnect
  async function handleDisconnect() {
    setIsLoading(true);
    onError?.(null);

    try {
      // TODO: Replace with actual API call to disconnect Discord
      // const response = await disconnectDiscord();
      const response = await logoutDiscordBridge();

      // Simulated response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsConnected(false);
      setUserInfo(null);
      onSuccess?.("Successfully disconnected from Discord");
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Failed to disconnect");
    } finally {
      setIsLoading(false);
    }
  }

  // Show loading state while checking
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

  // Show connected state
  if (isConnected && userInfo) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-muted p-4 space-y-2">
          <p className="text-sm font-medium">Already Connected</p>
          <p className="text-sm text-muted-foreground">
            Your Discord account is already connected to Matrix.
          </p>
          {userInfo.username && (
            <p className="text-sm">
              <span className="font-medium">Username:</span> {userInfo.username}
              {userInfo.discriminator && `#${userInfo.discriminator}`}
            </p>
          )}
          {userInfo.userId && (
            <p className="text-sm">
              <span className="font-medium">User ID:</span> {userInfo.userId}
            </p>
          )}
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

  // Show login form
  return (
    <div className="space-y-4">
      {/* QR Code Login */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Login with QR Code</h3>
        <Button
          onClick={onDiscordQRLogin}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <QrCode className="mr-2 h-4 w-4" />
          )}
          Generate QR Code
        </Button>
        {qrCode && (
          <div className="flex justify-center p-4 border rounded-lg bg-white">
            <QRCodeSVG
              value={qrCode}
              size={192} // 192px = w-48
              level="H" // 高容錯率
              includeMargin={true}
            />
          </div>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {/* Token Login */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Login with Token</h3>
        <Form {...discordTokenForm}>
          <form className="space-y-4">
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
                      <SelectItem value="bot">Bot Token</SelectItem>
                      <SelectItem value="oauth">OAuth Token</SelectItem>
                      <SelectItem value="user">User Token</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={discordTokenForm.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your Discord token"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              onClick={async (e) => {
                e.preventDefault();
                await discordTokenForm.handleSubmit(onDiscordTokenSubmit)();
              }}
            >
              {isLoading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Connect Discord
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
