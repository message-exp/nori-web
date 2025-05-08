"use client";

import { useEffect } from "react";
import { Login } from "@/components/login";
import { ThemeToggle } from "@/components/theme-toggle";
import { refreshToken } from "@/lib/matrix-api/refresh-token";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const redirectIfAuthenticated = async () => {
      const refreshStatus = await refreshToken();
      if (refreshStatus === "REFRESH_SUCCESS") {
        router.push("/home");
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
