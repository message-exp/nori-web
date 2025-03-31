import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";


export function Login({ className, props }: { className?: string, props?: any }) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const homeserver = formData.get("homeserver") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    console.log({ homeserver, username, password });
  }

  return (
    <Card className={`w-full sm:w-1/2 md:w-1/3 lg:w-1/4 ${className}`} {...props}>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="homeserver">Home server</Label>
              <Input id="homeserver" defaultValue="matrix.org" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="username" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="password" type="password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit">Sign in</Button>
      </CardFooter>
    </Card>
  );
}
