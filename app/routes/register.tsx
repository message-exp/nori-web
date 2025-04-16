import { Register } from "~/components/register";
import { ThemeToggle } from "~/components/theme-toggle";


export default function RegisterPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Register className="flex" />
      <div className="fixed bottom-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
