"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
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
import { HOME_SERVER } from "~/lib/env-config-helper";
import { register } from "~/lib/matrix-api/register";

// define form schema
const formSchema = z.object({
  username: z.string().trim().min(1).max(255),
  password: z.string().min(1),
});

export function Register({
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
      const response = await register(
        HOME_SERVER,
        values.username,
        values.password,
      );
      console.log("register response", response);
    } catch (error) {
      console.error("Error registering:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during registration.",
      );
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
        <CardTitle>Create an account</CardTitle>
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
                    <Input placeholder="user" {...field} />
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
              {isLoading ? <Loader className="animate-spin" /> : "Register"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="border-accent-foreground border-b-1 hover:border-b-2"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
