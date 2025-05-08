import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Login } from "~/components/login";
import { ThemeToggle } from "~/components/theme-toggle";
import { refreshToken } from "~/lib/matrix-api/refresh-token";

export default function LoginPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const redirectIfAuthenticated = async () => {
      const refreshStatus = await refreshToken();
      if (refreshStatus === "REFRESH_SUCCESS") {
        navigate("/home");
      }
    };
    redirectIfAuthenticated();
  }, []);
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Login className="flex" />
      <div className="fixed bottom-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
