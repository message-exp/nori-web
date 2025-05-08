import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Welcome to nori!</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/login" className="mr-3">
            <Button variant="outline">Sign in</Button>
          </Link>
          <Link href="/register">
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
