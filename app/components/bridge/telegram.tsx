"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
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
  getTelegramUserInfo,
  telegramLoginRequestCode,
  telegramLoginVerifyCode,
  telegramLogout,
} from "~/lib/contacts-server-api/bridge/telegram";

// Telegram Login Form Schemas
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

interface TelegramBridgeProps {
  onSuccess?: (message: string | null) => void;
  onError?: (error: string | null) => void;
  onCheckStart?: () => void;
  onCheckComplete?: () => void;
}

export function TelegramBridge({
  onSuccess,
  onError,
  onCheckStart,
  onCheckComplete,
}: TelegramBridgeProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(true);
  const [isConnected, setIsConnected] = React.useState(false);
  const [telegramStep, setTelegramStep] = React.useState<"phone" | "code">(
    "phone",
  );
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [isResending, setIsResending] = React.useState(false);

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

  // Check if user is already connected to Telegram
  React.useEffect(() => {
    async function checkConnection() {
      setIsChecking(true);
      onCheckStart?.();

      try {
        const response = await getTelegramUserInfo();
        console.log("Telegram connection check:", response);
        const connected = response.telegram != null;
        setIsConnected(connected);
      } catch (err) {
        console.error("Failed to check Telegram connection:", err);
        setIsConnected(false);
        onError?.("Failed to check Telegram connection status");
      } finally {
        setIsChecking(false);
        onCheckComplete?.();
      }
    }

    checkConnection();
  }, [onCheckStart, onCheckComplete, onError]);

  // Reset code form when switching to code step
  React.useEffect(() => {
    if (telegramStep === "code") {
      telegramCodeForm.reset({ code: "" });
    }
  }, [telegramStep, telegramCodeForm]);

  // Telegram Phone Submit
  async function onTelegramPhoneSubmit(
    values: z.infer<typeof telegramPhoneFormSchema>,
  ) {
    setIsLoading(true);
    onError?.(null);

    try {
      const response = await telegramLoginRequestCode(values.phone);
      setPhoneNumber(values.phone);
      setTelegramStep("code");
      onSuccess?.(`Verification code sent to ${values.phone}`);
      telegramCodeForm.reset();
    } catch (err) {
      onError?.(
        err instanceof Error ? err.message : "Failed to send verification code",
      );
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendCode() {
    setIsResending(true);
    onError?.(null);

    try {
      await telegramLoginRequestCode(phoneNumber);
      onSuccess?.(`Verification code resent to ${phoneNumber}`);
    } catch (err) {
      onError?.(
        err instanceof Error
          ? err.message
          : "Failed to resend verification code",
      );
    } finally {
      setIsResending(false);
    }
  }

  // Telegram Code Submit
  async function onTelegramCodeSubmit(
    values: z.infer<typeof telegramCodeFormSchema>,
  ) {
    setIsLoading(true);
    onError?.(null);

    try {
      const response = await telegramLoginVerifyCode(values.code);
      console.log("response", response);

      if (response?.state === "logged-in") {
        onSuccess?.("Successfully connected to Telegram!");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        window.location.reload();
      } else {
        setTelegramStep("phone");
        telegramPhoneForm.reset();
        telegramCodeForm.reset();
      }
    } catch (err) {
      onError?.(
        err instanceof Error ? err.message : "Invalid verification code",
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
      const response = await telegramLogout();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsConnected(false);
      onSuccess?.("Successfully disconnected from Telegram");
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
  if (isConnected) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-muted p-4 space-y-2">
          <p className="text-sm font-medium">Already Connected</p>
          <p className="text-sm text-muted-foreground">
            Your Telegram account is already connected to Matrix.
          </p>
        </div>
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleDisconnect}
          disabled={isLoading}
        >
          {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
          Disconnect Telegram
        </Button>
      </div>
    );
  }

  // Show login form
  return (
    <div className="space-y-4">
      {telegramStep === "phone" ? (
        // step 1: 輸入電話號碼
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Step 1: Enter your phone number to receive a verification code
          </div>
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
                  await telegramPhoneForm.handleSubmit(onTelegramPhoneSubmit)();
                }}
              >
                {isLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Send Verification Code
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        // step 2: 輸入驗證碼
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <p className="text-sm font-medium">
              Step 2: Enter verification code
            </p>
            <p className="text-sm text-muted-foreground">
              A verification code has been sent to your Telegram app. Please
              enter it below.
            </p>
          </div>
          <Form {...telegramCodeForm} key="telegram-code-form">
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
                        placeholder="Enter 5-6 digit code"
                        autoComplete="off"
                        autoFocus
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
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
                    onError?.(null);
                    onSuccess?.(null);
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
                    await telegramCodeForm.handleSubmit(onTelegramCodeSubmit)();
                  }}
                >
                  {isLoading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Verify & Connect
                </Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleResendCode}
                disabled={isResending || isLoading}
              >
                {isResending ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Resend Verification Code
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
