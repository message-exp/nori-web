import type { Route } from "./+types/_index";
import { Welcome } from "../welcome/welcome";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  // return <Welcome />;
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Welcome to nori!</CardTitle>
        </CardHeader>
        <CardContent>
          <a href="/login" className="mr-3">
            <Button variant="outline">Sign in</Button>
          </a>
          <a href="/register">
            <Button variant="outline">Create an account</Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
