import type { Route } from "./+types/_index";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { ThemeToggle } from "~/components/theme-toggle";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Welcome to nori!</CardTitle>
        </CardHeader>
        <CardContent>
          <Link to="/login" className="mr-3">
            <Button variant="outline">Sign in</Button>
          </Link>
          <Link to="/register">
            <Button variant="outline">Create an account</Button>
          </Link>
        </CardContent>
      </Card>
      <div className="fixed bottom-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
