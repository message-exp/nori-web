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

// Discord Login Form Schema
const discordTokenFormSchema = z.object({
  token: z.string().trim().min(1, "Token is required"),
  tokenType: z.enum(["bot", "oauth", "user"]),
});

interface DiscordBridgeProps {
  onSuccess?: (message: string | null) => void;
  onError?: (error: string | null) => void;
}

export function DiscordBridge({ onSuccess, onError }: DiscordBridgeProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [qrCode, setQrCode] = React.useState<string | null>(null);

  // Discord Token Form
  const discordTokenForm = useForm<z.infer<typeof discordTokenFormSchema>>({
    resolver: zodResolver(discordTokenFormSchema),
    defaultValues: {
      token: "",
      tokenType: "bot",
    },
  });

  // Discord QR Code Login
  async function onDiscordQRLogin() {
    setIsLoading(true);
    onError?.(null);
    onSuccess?.(null);
    setQrCode(null);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/bridge/discord/users/login/qrcode', {
      //   headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
      // });
      // const data = await response.json();

      // Simulated response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setQrCode(
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=discord_qr_placeholder",
      );
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
      // const response = await fetch('/api/bridge/discord/users/login/token', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': 'Bearer YOUR_TOKEN',
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(values)
      // });
      // const data = await response.json();

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
          <div className="flex justify-center p-4 border rounded-lg">
            <img src={qrCode} alt="Discord QR Code" className="w-48 h-48" />
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
