import { AlertTriangle, ArrowLeft, Camera, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export default function RoomSettingsSkeleton({ roomId }: { roomId: string }) {
  const navigate = useNavigate();

  function back() {
    navigate(`/home/${roomId}`);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <Button variant="ghost" size="icon" className="mr-2" onClick={back}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold">Room Settings</h1>
          </div>
        </div>
      </div>
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        {/* Room Information */}
        <Card>
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
            <CardDescription>
              Manage your room's basic information and appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Room Avatar */}
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
                <h3 className="font-medium">Room Photo</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a photo to personalize your room
                </p>
              </div>
            </div>

            {/* Room Name */}
            <div className="space-y-2">
              <Label>Room Name</Label>
              <Input placeholder="Loading..." disabled />
            </div>

            {/* Room Description */}
            <div className="space-y-2">
              <Label>Topic</Label>
              <Textarea placeholder="Loading..." rows={3} disabled />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that affect this room
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                These actions cannot be undone. Please proceed with caution.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="destructive" className="flex-1" disabled>
                <LogOut className="h-4 w-4 mr-2" />
                Leave Room
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Changes */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" type="reset" onClick={back}>
            Cancel
          </Button>
          <Button type="submit" disabled>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
