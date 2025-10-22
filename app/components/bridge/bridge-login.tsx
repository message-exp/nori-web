"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader, QrCode } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
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

// Telegram Login Form Schema
const telegramPhoneFormSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(
      /^\+\d{10,15}$/,
      "Phone must include country code (e.g., +886912345678)",
    ),
});

const telegramCodeFormSchema = z.object({
  code: z.string().trim().min(1, "Verification code is required"),
});

type BridgeType = "discord" | "telegram";

export function BridgeLogin({
  className,
  props,
}: {
  className?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const [activeBridge, setActiveBridge] = React.useState<BridgeType>("discord");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Telegram specific states
  const [telegramStep, setTelegramStep] = React.useState<"phone" | "code">(
    "phone",
  );
  const [qrCode, setQrCode] = React.useState<string | null>(null);

  // Discord Token Form
  const discordTokenForm = useForm<z.infer<typeof discordTokenFormSchema>>({
    resolver: zodResolver(discordTokenFormSchema),
    defaultValues: {
      token: "",
      tokenType: "bot",
    },
  });

  // Telegram Phone Form
  const telegramPhoneForm = useForm<z.infer<typeof telegramPhoneFormSchema>>({
    resolver: zodResolver(telegramPhoneFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  // Telegram Code Form
  const telegramCodeForm = useForm<z.infer<typeof telegramCodeFormSchema>>({
    resolver: zodResolver(telegramCodeFormSchema),
    defaultValues: {
      code: "",
    },
  });

  // Reset states when switching bridges
  React.useEffect(() => {
    setError(null);
    setSuccess(null);
    setQrCode(null);
    setTelegramStep("phone");
    discordTokenForm.reset();
    telegramPhoneForm.reset();
    telegramCodeForm.reset();
  }, [activeBridge]);

  // Discord QR Code Login
  async function onDiscordQRLogin() {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
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
      setSuccess("Scan the QR code with Discord mobile app");
    } catch (err) {
      setError(
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
    setError(null);
    setSuccess(null);

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
      setSuccess("Successfully connected to Discord!");
      discordTokenForm.reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to login with token",
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Telegram Phone Submit
  async function onTelegramPhoneSubmit(
    values: z.infer<typeof telegramPhoneFormSchema>,
  ) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/bridge/telegram/users/login/code', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': 'Bearer YOUR_TOKEN',
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ phone: values.phone })
      // });
      // const data = await response.json();

      // Simulated response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTelegramStep("code");
      setSuccess(`Verification code sent to ${values.phone}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send verification code",
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Telegram Code Submit
  async function onTelegramCodeSubmit(
    values: z.infer<typeof telegramCodeFormSchema>,
  ) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/bridge/telegram/users/login/code/verify', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': 'Bearer YOUR_TOKEN',
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ code: values.code })
      // });
      // const data = await response.json();

      // Simulated response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Successfully connected to Telegram!");
      setTelegramStep("phone");
      telegramPhoneForm.reset();
      telegramCodeForm.reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid verification code",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Bridge Login</CardTitle>
        <CardDescription>
          Connect your Discord or Telegram account to Matrix
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Global Alerts */}
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

        {/* Bridge Selection Tabs */}
        <Tabs
          value={activeBridge}
          onValueChange={(v) => setActiveBridge(v as BridgeType)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="discord">Discord</TabsTrigger>
            <TabsTrigger value="telegram">Telegram</TabsTrigger>
          </TabsList>

          {/* Discord Tab */}
          <TabsContent value="discord" className="space-y-4">
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
                    <img
                      src={qrCode}
                      alt="Discord QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
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
                        await discordTokenForm.handleSubmit(
                          onDiscordTokenSubmit,
                        )();
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
          </TabsContent>

          {/* Telegram Tab */}
          <TabsContent value="telegram" className="space-y-4">
            {telegramStep === "phone" ? (
              <Form {...telegramPhoneForm}>
                <form className="space-y-4">
                  <FormField
                    control={telegramPhoneForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+886912345678"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          Include country code (e.g., +886 for Taiwan)
                        </p>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                    onClick={async (e) => {
                      e.preventDefault();
                      await telegramPhoneForm.handleSubmit(
                        onTelegramPhoneSubmit,
                      )();
                    }}
                  >
                    {isLoading ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Send Verification Code
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...telegramCodeForm}>
                <form className="space-y-4">
                  <FormField
                    control={telegramCodeForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter code from Telegram"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setTelegramStep("phone");
                        telegramCodeForm.reset();
                        setError(null);
                        setSuccess(null);
                      }}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1"
                      onClick={async (e) => {
                        e.preventDefault();
                        await telegramCodeForm.handleSubmit(
                          onTelegramCodeSubmit,
                        )();
                      }}
                    >
                      {isLoading ? (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Verify & Connect
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
