"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
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
import { debouncePromise } from "~/lib/debounce-helper";
import { login } from "~/lib/matrix-api/login";
import { getBaseUrl } from "~/lib/matrix-api/utils";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Link, useNavigate } from "react-router";
const debouncedGetBaseUrl = debouncePromise(getBaseUrl, 1000); // 1 second cooldown

// define form schema
const formSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .refine(
      // check whether the domain in the user ID in valid
      async (username) => {
        const baseUrl = await debouncedGetBaseUrl(username);
        return (
          baseUrl !== "IGNORE" &&
          baseUrl !== "FAIL_PROMPT" &&
          baseUrl !== "FAIL_ERROR"
        );
      },
      { message: "The domain is invalid." },
    ),
  password: z.string().min(1),
});

export function Login({
  className,
  props,
}: {
  className?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const [isLoading, setIsLoading] = React.useState(false); // a state to control the submit button loading animation
  const [error, setError] = React.useState<string | null>(null); // a state to control the form error message

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await login(values.username, values.password);
      console.log("login response", response);
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid username or password");
      return;
    }

    // redirect to the home page
    navigate("/home");
  }

  return (
    <Card
      className={`w-full sm:w-1/2 md:w-1/3 lg:w-1/4 ${className}`}
      {...props}
    >
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4" variant="destructive" hidden={!error}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="@user:matrix.org" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              onClick={async () => {
                setIsLoading(true);
                setError(null);
                await form.handleSubmit(onSubmit)();
                setIsLoading(false);
              }}
            >
              {isLoading ? <Loader className="animate-spin" /> : "Sign in"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Have no account?{" "}
          <Link
            to="/register"
            className="border-accent-foreground border-b-1 hover:border-b-2"
          >
            Create an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
