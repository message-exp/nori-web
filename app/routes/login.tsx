import { Login } from "~/components/login";
import { ThemeToggle } from "~/components/theme-toggle";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Login className="flex" />
      <div className="fixed bottom-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
