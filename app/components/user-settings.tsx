import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader, LogOut } from "lucide-react";
import type { User } from "matrix-js-sdk";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { ThemeSelect } from "~/components/theme-select";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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
import { Label } from "~/components/ui/label";
import { logout } from "~/lib/matrix-api/logout";

const formSchema = z.object({
  user_display_name: z.string().min(1),
});

export default function UserSettings({ user }: { user: User | undefined }) {
  const navigate = useNavigate();
  const [loadingProfile, setLoadingProfile] = useState(user === undefined);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_display_name: user?.rawDisplayName || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        user_display_name: user.rawDisplayName || "",
      });
      setLoadingProfile(false);
    }
  }, [user, form]);

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  // setLoadingProfile(true);
  // do actions and reset the form
  // notify the user about the success or failure
  // setLoadingProfile(false);
  // }

  async function handleLogout() {
    setLoadingLogout(true);
    const success = await logout();
    if (success) {
      console.log("logout successful");
      navigate("/login");
    } else {
      console.log("logout failed");
    }
    setLoadingLogout(false);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="flex h-14 items-center px-4">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold">Account Settings</h1>
            </div>
          </div>
        </div>
        <Form {...form}>
          <form>
            {" "}
            {/* onSubmit={form.handleSubmit(onSubmit)}> */}
            <div className="container max-w-4xl mx-auto p-4 space-y-6">
              {/* User Profile */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Manage your basic information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* User Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="/placeholder.svg?height=80&width=80" />
                        <AvatarFallback className="text-lg">TR</AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">User Photo</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload a photo to personalize your profile
                      </p>
                    </div>
                  </div>

                  {/* User Display Name */}
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="user_display_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                loadingProfile ? "Loading..." : "Display name"
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Appearance */}
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Theme */}
                  <div className="flex items-center justify-between">
                    <Label>Theme</Label>
                    <ThemeSelect />
                  </div>
                </CardContent>
              </Card>

              {/* Save Changes */}
              {/* <div className="flex justify-end gap-3">
                <Button variant="outline" type="reset">
                  Cancel (TODO: onClick → reset the form)
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin" />
                      Saving Changes
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div> */}

              {/* log out */}
              <Button
                variant="destructive"
                className="flex-1 w-full"
                onClick={handleLogout}
                disabled={loadingLogout}
              >
                {loadingLogout ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                Log out
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
