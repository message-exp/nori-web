"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, LoaderCircle } from "lucide-react";
import React from "react";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { debouncePromise } from "~/lib/debounce-helper";
import { getBaseUrl } from "~/lib/matrix-api/utils";


const debouncedGetBaseUrl = debouncePromise(getBaseUrl, 1000); // 1 second cooldown

// define form schema
const formSchema = z.object({
  username: z.string()
    .trim()
    .min(1)
    .max(255)
    .refine(  // check whether the domain in the user ID in valid
      async (username) => {
        const baseUrl = await debouncedGetBaseUrl(username);
        return baseUrl !== "IGNORE" && baseUrl !== "FAIL_PROMPT" && baseUrl !== "FAIL_ERROR";
      },
      { message: "The domain is invalid." }
    ),
  password: z.string().min(1),
})

export function Login({ className, props }: { className?: string, props?: any }) {
  const [isLoading, setIsLoading] = React.useState(false);  // a state to control the submit button loading animation

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Card className={`w-full sm:w-1/2 md:w-1/3 lg:w-1/4 ${className}`} {...props}>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent>
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
            <Button type="submit" disabled={isLoading} className="w-full"
              onClick={async () => {
                setIsLoading(true);
                await form.handleSubmit(onSubmit)();
                setIsLoading(false);
              }}
            >
                { isLoading 
                  ? <Loader className="animate-spin" />
                  : "Sign in" }
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
